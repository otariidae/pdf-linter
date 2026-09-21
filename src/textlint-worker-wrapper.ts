import type {
  TextlintWorkerCommandLint,
  TextlintWorkerCommandResponse,
  TextlintWorkerCommandResponseInit,
  TextlintWorkerCommandResponseLint,
} from "@textlint/script-compiler"
import { agentLog } from "./debug-log"

export class TextlintWorkerWrapper {
  worker: Worker
  #initDataPromise: Promise<TextlintWorkerCommandResponseInit>

  constructor(worker: Worker) {
    this.worker = worker
    // #region agent log
    agentLog(
      "B",
      "textlint-worker-wrapper.ts:constructor",
      "TextlintWorkerWrapper constructed",
      {
        workerUrl: String((worker as Worker & { url?: string }).url ?? "unknown"),
      },
    )
    // #endregion
    const initAbortController = new AbortController()
    this.#initDataPromise = new Promise((resolve, reject) => {
      this.worker.addEventListener(
        "error",
        (err) => {
          // #region agent log
          agentLog(
            "B",
            "textlint-worker-wrapper.ts:error",
            "worker error event",
            {
              error: String(err),
              filename: (err as ErrorEvent).filename,
              messageText: (err as ErrorEvent).message,
            },
          )
          // #endregion
          reject(err)
        },
        {
          signal: initAbortController.signal,
        },
      )
      this.worker.addEventListener(
        "message",
        (event: MessageEvent<TextlintWorkerCommandResponse>) => {
          // #region agent log
          agentLog("B", "textlint-worker-wrapper.ts:message", "worker message", {
            command: event.data.command,
            id: "id" in event.data ? event.data.id : undefined,
          })
          // #endregion
          if (event.data.command === "init") {
            resolve(event.data)
          }
        },
        { signal: initAbortController.signal },
      )
    })
    this.#initDataPromise.finally(() => {
      initAbortController.abort()
    })
  }

  waitForInit(): Promise<TextlintWorkerCommandResponseInit> {
    return this.#initDataPromise
  }

  lint(text: string): Promise<TextlintWorkerCommandResponseLint> {
    const id = crypto.randomUUID()
    const controller = new AbortController()
    const lintCommand: TextlintWorkerCommandLint = {
      id,
      command: "lint",
      text,
      ext: ".txt",
    }
    // #region agent log
    agentLog("B", "textlint-worker-wrapper.ts:lint:post", "posting lint command", {
      id,
      textLength: text.length,
      textPreview: text.slice(0, 100),
    })
    // #endregion
    return new Promise<TextlintWorkerCommandResponseLint>((resolve) => {
      this.worker.addEventListener(
        "message",
        (event: MessageEvent<TextlintWorkerCommandResponse>) => {
          if (event.data.command === "lint:result" && event.data.id === id) {
            // #region agent log
            const msgs = event.data.result?.messages ?? []
            agentLog(
              "D",
              "textlint-worker-wrapper.ts:lint:result",
              "lint result received",
              {
                id,
                messageCount: msgs.length,
                ruleIds: msgs.map((m) => m.ruleId),
              },
            )
            // #endregion
            resolve(event.data)
          }
        },
        { signal: controller.signal },
      )
      this.worker.postMessage(lintCommand)
    }).finally(() => {
      controller.abort()
    })
  }
}
