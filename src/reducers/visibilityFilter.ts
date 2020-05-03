import { Reducer } from "redux"
import { isType } from "typescript-fsa"
import { toggleVisibilityFilter } from "../actions"
import { State } from "../type"
import { initialState } from "./index"

const reducer: Reducer<State["visibilityFilter"]> = function reducer(
  state,
  action
) {
  if (typeof state === "undefined") {
    return initialState.visibilityFilter
  }
  if (isType(action, toggleVisibilityFilter)) {
    const value = action.payload
    if (state.includes(value)) {
      return state.filter((ruleId) => ruleId !== value)
    }
    return state.concat(value)
  }
  return state
}

export default reducer
