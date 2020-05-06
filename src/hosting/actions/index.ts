import actionCreatorFactory from "typescript-fsa"
import { LintResult } from "../../type"

const actionCreator = actionCreatorFactory()
export const onFileInput = actionCreator<{ file: File }>("ON_FILE_INPUT")
export const onLintFinished = actionCreator<{ lintResults: LintResult }>(
  "ON_LINT_FINISHED"
)

export const toggleVisibilityFilter = actionCreator<string>(
  "TOGGLE_VISIBILITY_FILTER"
)
export const toggleSoloFilter = actionCreator<string>("TOGGLE_SOLO_FILTER")
