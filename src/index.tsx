import React, { StrictMode } from "react"
import ReactDOM, { render } from "react-dom"
import { RecoilRoot } from "recoil"
import App from "./components/app"

if (process.env.NODE_ENV !== "production") {
  import("@axe-core/react")
    .then(({ default: axe }) => axe(React, ReactDOM, 1000))
    .catch((e) => console.error(e))
}
render(
  <StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </StrictMode>,
  document.getElementById("app")
)
