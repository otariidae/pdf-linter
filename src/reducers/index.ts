import { combineReducers } from "redux"
import { State } from "../type"
import fileReducer from "./file"
import lintResultsReducer from "./lintResults"
import visibilityFilterReducer from "./visibilityFilter"
import soloFilterReducer from "./soloFilter"

export const initialState: State = {
  file: null,
  lintResults: [],
  visibilityFilter: [],
  soloFilter: [],
}

export default combineReducers({
  file: fileReducer,
  lintResults: lintResultsReducer,
  visibilityFilter: visibilityFilterReducer,
  soloFilter: soloFilterReducer,
})
