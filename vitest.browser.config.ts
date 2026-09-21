import { appendFileSync, mkdirSync } from "node:fs"
import type { Plugin } from "vite"
import react from "@vitejs/plugin-react"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"

// #region agent log
/** Vite middleware: browser tests POST here; writes NDJSON to debug.log */
function agentDebugLogPlugin(): Plugin {
  const logPath = "/opt/cursor/logs/debug.log"
  return {
    name: "agent-debug-log",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url !== "/__agent_debug_log" || req.method !== "POST") {
          next()
          return
        }
        const chunks: Buffer[] = []
        req.on("data", (c) => chunks.push(c))
        req.on("end", () => {
          try {
            mkdirSync("/opt/cursor/logs", { recursive: true })
            const body = Buffer.concat(chunks).toString("utf8")
            appendFileSync(logPath, `${body.trim()}\n`)
            res.statusCode = 204
            res.end()
          } catch (e) {
            res.statusCode = 500
            res.end(String(e))
          }
        })
      })
    },
  }
}
// #endregion

export default defineConfig({
  plugins: [react(), agentDebugLogPlugin()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      // https://vitest.dev/config/browser/playwright
      instances: [{ browser: "chromium" }],
    },
  },
})
