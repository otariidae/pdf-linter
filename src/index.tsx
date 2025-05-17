import { Global } from "@emotion/react"
import React, { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import * as ReactDOM from "react-dom"
import App from "./components/app"

if (process.env.NODE_ENV !== "production") {
  import("@axe-core/react")
    .then(({ default: axe }) => axe(React, ReactDOM, 1000))
    .catch((e) => {
      console.error(e)
    })
}

const container = document.getElementById("app")
if (!container) {
  throw new Error("Failed to find the root element")
}
const root = createRoot(container)
root.render(
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
)
