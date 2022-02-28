import type {
  TextlintWorkerCommandLint,
  TextlintWorkerCommandResponse,
  TextlintWorkerCommandResponseLint,
} from "@textlint/script-compiler"

// picked from builtin TypeScript definition
type PromiseResolver<T> = (value?: T | PromiseLike<T>) => void

const waitForTextlintWorkerInitialized = (worker: Worker): Promise<void> => {
  let _resolve: PromiseResolver<void> | null = null
  worker.addEventListener(
    "message",
    (event) => {
      const data: TextlintWorkerCommandResponse = event.data
      if (data.command === "init" && _resolve !== null) {
        _resolve()
      }
    },
    {
      once: true,
    }
  )
  return new Promise((resolve) => {
    _resolve = resolve
  })
}

export const createTextlint = async () => {
  const worker = new Worker("textlint-worker.js")

  await waitForTextlintWorkerInitialized(worker)

  const lintText = (text: string): Promise<TextlintWorkerCommandResponseLint> =>
    new Promise((resolve) => {
      worker.addEventListener(
        "message",
        (event) => {
          const data: TextlintWorkerCommandResponse = event.data
          if (data.command !== "lint:result") {
            return
          }
          resolve(data)
        },
        {
          once: true,
        }
      )
      const lintCommand = {
        command: "lint",
        text,
        ext: ".txt",
      } as TextlintWorkerCommandLint
      worker.postMessage(lintCommand)
    })
  const exit = () => worker.terminate()
  return {
    lintText,
    exit,
  }
}
