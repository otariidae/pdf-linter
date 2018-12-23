import actionCreatorFactory from "typescript-fsa"
import { LintResult } from "../type"

const actionCreator = actionCreatorFactory()
export const onFileInput = actionCreator<{ file: File }>("ON_FILE_INPUT")
export const onLintFinished = actionCreator<{ lintResults: LintResult }>(
  "ON_LINT_FINISHED"
)
