import React from "react"
import { render } from "react-dom"
import { createStore } from "redux"
import { Provider } from "react-redux"
import reducer, { initialState } from "./reducers"
import App from "./components/app"

const store = createStore(reducer, initialState)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
)
