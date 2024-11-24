import { atom } from "jotai"
import { atomWithDefault } from "jotai/utils"
import { extractTextFromPDFFile, lintPDFTexts } from "./pdf"

export const fileState = atom<File | null>(null)

export const fileTextContentsState = atomWithDefault(async (get) => {
  const file = get(fileState)
  if (file === null) {
    return null
  }
  const fileTextContents = await extractTextFromPDFFile(file)
  return fileTextContents
})

export const lintResultState = atomWithDefault(async (get) => {
  const fileTextContents = await get(fileTextContentsState)
  if (fileTextContents === null) {
    return []
  }
  const lintResult = await lintPDFTexts(fileTextContents)
  return lintResult
})

export const soloFilterState = atom(new Set<string>())

export const visibilityFilterState = atom(new Set<string>())

export const filteredLintResultState = atom(async (get) => {
  const lintResults = await get(lintResultState)
  const soloFilter = get(soloFilterState)
  const visibilityFilter = get(visibilityFilterState)
  if (soloFilter.size > 0) {
    return lintResults.filter((message) => soloFilter.has(message.ruleId))
  }
  return lintResults.filter((message) => !visibilityFilter.has(message.ruleId))
})
