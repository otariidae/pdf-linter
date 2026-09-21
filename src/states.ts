import { atom } from "jotai"
import { agentLog } from "./debug-log"
import { extractTextFromPDFFile, lintPDFTexts } from "./pdf"

export const fileState = atom<File | null>(null)

export const fileTextContentsState = atom(async (get) => {
  const file = get(fileState)
  // #region agent log
  agentLog("C", "states.ts:fileTextContentsState", "fileTextContentsState read", {
    hasFile: file !== null,
    fileName: file?.name ?? null,
  })
  // #endregion
  if (file === null) {
    return null
  }
  const fileTextContents = await extractTextFromPDFFile(file)
  // #region agent log
  agentLog(
    "C",
    "states.ts:fileTextContentsState:done",
    "fileTextContentsState resolved",
    {
      pageCount: fileTextContents.length,
    },
  )
  // #endregion
  return fileTextContents
})

export const lintResultState = atom(async (get) => {
  // #region agent log
  agentLog("C", "states.ts:lintResultState", "lintResultState read start", {})
  // #endregion
  const fileTextContents = await get(fileTextContentsState)
  if (fileTextContents === null) {
    return []
  }
  const lintResult = await lintPDFTexts(fileTextContents)
  // #region agent log
  agentLog("C", "states.ts:lintResultState:done", "lintResultState resolved", {
    count: lintResult.length,
    ruleIds: lintResult.map((m) => m.ruleId),
  })
  // #endregion
  return lintResult
})

export const soloFilterState = atom(new Set<string>())

export const visibilityFilterState = atom(new Set<string>())

export const filteredLintResultState = atom(async (get) => {
  const lintResults = await get(lintResultState)
  const soloFilter = get(soloFilterState)
  const visibilityFilter = get(visibilityFilterState)
  const filtered =
    soloFilter.size > 0
      ? lintResults.filter((message) => soloFilter.has(message.ruleId))
      : lintResults.filter((message) => !visibilityFilter.has(message.ruleId))
  // #region agent log
  agentLog(
    "E",
    "states.ts:filteredLintResultState",
    "filteredLintResultState resolved",
    {
      rawCount: lintResults.length,
      filteredCount: filtered.length,
      mutedCount: visibilityFilter.size,
      ruleIds: filtered.map((m) => m.ruleId),
      severities: filtered.map((m) => m.severity),
      errorCount: filtered.filter((m) => m.severity === 2).length,
    },
  )
  // #endregion
  return filtered
})
