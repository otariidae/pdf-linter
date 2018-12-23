import { Action } from "redux"
import { isType } from "typescript-fsa"
import { onFileInput, onLintFinished } from "../actions"
import { LintResult } from "../type"

export interface State {
  file: File | null
  lintResults: LintResult
}
export const initialState: State = {
  file: null,
  lintResults: []
}

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  if (isType(action, onFileInput)) {
    return Object.assign({}, state, {
      file: action.payload.file
    })
  }
  if (isType(action, onLintFinished)) {
    return Object.assign({}, state, {
      lintResults: action.payload.lintResults
    })
  }
  return state
}
