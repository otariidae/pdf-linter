import "@radix-ui/themes/styles.css"
import { Theme } from "@radix-ui/themes"
import React, { StrictMode } from "react"
import * as ReactDOM from "react-dom"
import { createRoot } from "react-dom/client"
import App from "./components/app"
import "./global.css"

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
    <Theme
      accentColor="crimson"
      grayColor="slate"
      radius="medium"
      style={{
        height: "100%",
      }}
    >
      <App />
    </Theme>
  </StrictMode>,
)
