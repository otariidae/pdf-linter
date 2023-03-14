import { type TextlintMessage } from "@textlint/kernel"

export interface LintMessage extends TextlintMessage {
  page: number
}
export type LintResult = LintMessage[]
