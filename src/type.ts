import { TextlintResult } from "@textlint/kernel"

export type LintResultPerPage = TextlintResult[]
export type LintResult = LintResultPerPage[]

export interface State {
  file: File | null
  lintResults: LintResult
  visibilityFilter: string[]
}
