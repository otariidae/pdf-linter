import { atom, selector } from "recoil"
import { LintResult } from "../type"

export const fileState = atom<File>({
  key: "file",
  default: null,
})

export const lintResultState = atom<LintResult>({
  key: "lintResult",
  default: [],
})

export const soloFilterState = atom<string[]>({
  key: "soloFilter",
  default: [],
})

export const visibilityFilterState = atom<string[]>({
  key: "visibilityFilter",
  default: [],
})

export const filteredLintResultState = selector({
  key: "filteredLintResult",
  get: ({ get }) => {
    const lintResults = get(lintResultState)
    const soloFilter = get(soloFilterState)
    const visibilityFilter = get(visibilityFilterState)
    if (soloFilter.length > 0) {
      return lintResults.filter((message) =>
        soloFilter.includes(message.ruleId)
      )
    }
    return lintResults.filter(
      (message) => !visibilityFilter.includes(message.ruleId)
    )
  },
})
