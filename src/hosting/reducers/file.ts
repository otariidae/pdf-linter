import { Reducer } from "redux"
import { isType } from "typescript-fsa"
import { onFileInput } from "../actions"
import { State } from "../../type"
import { initialState } from "./index"

const reducer: Reducer<State["file"]> = function reducer(state, action) {
  if (typeof state === "undefined") {
    return initialState.file
  }
  if (isType(action, onFileInput)) {
    return action.payload.file
  }
  return state
}

export default reducer
