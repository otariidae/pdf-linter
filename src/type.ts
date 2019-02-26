import { TextlintMessage } from "@textlint/kernel"

export interface LintMessage extends TextlintMessage {
  page: number
}
export type LintResult = LintMessage[]

export interface State {
  file: File | null
  lintResults: LintResult
  visibilityFilter: string[]
}
