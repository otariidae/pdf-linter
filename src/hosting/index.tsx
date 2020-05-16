import React, { StrictMode } from "react"
import ReactDOM, { render } from "react-dom"
import { createStore } from "redux"
import { Provider } from "react-redux"
import reducer, { initialState } from "./reducers"
import App from "./components/app"

const store = createStore(reducer, initialState)

if (process.env.NODE_ENV !== "production") {
  const axe = require("react-axe")
  axe(React, ReactDOM, 1000)
}
render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById("app")
)