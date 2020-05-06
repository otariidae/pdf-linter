import { Reducer } from "redux"
import { isType } from "typescript-fsa"
import { onLintFinished } from "../actions"
import { State } from "../../type"
import { initialState } from "./index"

const reducer: Reducer<State["lintResults"]> = function reducer(state, action) {
  if (typeof state === "undefined") {
    return initialState.lintResults
  }
  if (isType(action, onLintFinished)) {
    return action.payload.lintResults
  }
  return state
}

export default reducer
