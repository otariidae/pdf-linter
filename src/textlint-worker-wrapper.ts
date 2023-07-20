import type {
  TextlintWorkerCommandLint,
  TextlintWorkerCommandResponse,
  TextlintWorkerCommandResponseInit,
  TextlintWorkerCommandResponseLint,
} from "@textlint/script-compiler"

export class TextlintWorkerWrapper {
  worker: Worker
  #initDataPromise: Promise<TextlintWorkerCommandResponseInit>

  constructor(worker: Worker) {
    this.worker = worker
    const initAbortController = new AbortController()
    this.#initDataPromise = new Promise((resolve, reject) => {
      this.worker.addEventListener("error", reject, {
        signal: initAbortController.signal,
      })
      this.worker.addEventListener(
        "message",
        (event: MessageEvent<TextlintWorkerCommandResponse>) => {
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
    return new Promise<TextlintWorkerCommandResponseLint>((resolve, _) => {
      this.worker.addEventListener(
        "message",
        (event: MessageEvent<TextlintWorkerCommandResponse>) => {
          if (event.data.command === "lint:result" && event.data.id === id) {
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
