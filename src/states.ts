import { atom, selector } from "recoil"
import { lintPDFFile } from "./pdf"

export const fileState = atom<File | null>({
  key: "file",
  default: null,
})

export const lintResultState = selector({
  key: "lintResult",
  get: async ({ get }) => {
    const file = get(fileState)
    if (file === null) {
      return []
    }
    const lintResult = await lintPDFFile(file)
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
      (message) => !visibilityFilter.has(message.ruleId)
    )
  },
})
