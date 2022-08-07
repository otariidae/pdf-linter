import React, { StrictMode } from "react"
import ReactDOM, { render } from "react-dom"
import { RecoilRoot } from "recoil"
import App from "./components/app"

if (process.env.NODE_ENV !== "production") {
  const axe = require("@axe-core/react")
  axe(React, ReactDOM, 1000)
}
render(
  <StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </StrictMode>,
  document.getElementById("app")
)
