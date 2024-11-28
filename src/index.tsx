import { Global } from "@emotion/react"
import React, { StrictMode } from "react"
import ReactDOM, { render } from "react-dom"
import App from "./components/app"

if (process.env.NODE_ENV !== "production") {
  import("@axe-core/react")
    .then(({ default: axe }) => axe(React, ReactDOM, 1000))
    .catch((e) => {
      console.error(e)
    })
}
render(
  <StrictMode>
    <Global
      styles={{
        body: {
          margin: 0,
          height: "100dvh",
          overflow: "hidden",
        },
        "#app": {
          height: "100%",
        },
      }}
    />
    <App />
  </StrictMode>,
  document.getElementById("app"),
)
