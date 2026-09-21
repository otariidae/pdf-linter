/** Browser-safe debug logger for DEBUG MODE — posts to Vite middleware. */
export function agentLog(
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown> = {},
): void {
  // #region agent log
  const payload = {
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now(),
    sessionId: "891e",
  }
  try {
    fetch("/__agent_debug_log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {})
  } catch {
    // ignore
  }
  // #endregion
}
