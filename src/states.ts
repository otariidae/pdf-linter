import { atom, selector } from "recoil"
import { extractTextFromPDFFile, lintPDFTexts } from "./pdf"

export const fileState = atom<File | null>({
  key: "file",
  default: null,
})

export const fileTextContentsState = selector({
  key: "fileTextContents",
  get: async ({ get }) => {
    const file = get(fileState)
    if (file === null) {
      return null
    }
    const fileTextContents = await extractTextFromPDFFile(file)
    return fileTextContents
  },
})

export const lintResultState = selector({
  key: "lintResult",
  get: async ({ get }) => {
    const fileTextContents = get(fileTextContentsState)
    if (fileTextContents === null) {
      return []
    }
    const lintResult = await lintPDFTexts(fileTextContents)
    return lintResult
  },
})

export const soloFilterState = atom<Set<string>>({
  key: "soloFilter",
  default: new Set(),
})

export const visibilityFilterState = atom<Set<string>>({
  key: "visibilityFilter",
  default: new Set(),
})

export const filteredLintResultState = selector({
  key: "filteredLintResult",
  get: ({ get }) => {
    const lintResults = get(lintResultState)
    const soloFilter = get(soloFilterState)
    const visibilityFilter = get(visibilityFilterState)
    if (soloFilter.size > 0) {
      return lintResults.filter((message) => soloFilter.has(message.ruleId))
    }
    return lintResults.filter(
      (message) => !visibilityFilter.has(message.ruleId),
    )
  },
})
