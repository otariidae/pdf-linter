import { Reducer } from "redux"
import { isType } from "typescript-fsa"
import { toggleSoloFilter } from "../actions"
import { State } from "../../type"
import { initialState } from "./index"

const reducer: Reducer<State["soloFilter"]> = function reducer(state, action) {
  if (typeof state === "undefined") {
    return initialState.soloFilter
  }
  if (isType(action, toggleSoloFilter)) {
    const value = action.payload
    if (state.includes(value)) {
      return state.filter((ruleId) => ruleId !== value)
    }
    return state.concat(value)
  }
  return state
}

export default reducer
