import { combineReducers } from "redux"
import { State } from "../type"
import fileReducer from "./file"
import lintResultsReducer from "./lintResults"
import visibilityFilterReducer from "./visibilityFilter"

export const initialState: State = {
  file: null,
  lintResults: [],
  visibilityFilter: []
}

export default combineReducers({
  file: fileReducer,
  lintResults: lintResultsReducer,
  visibilityFilter: visibilityFilterReducer
})
