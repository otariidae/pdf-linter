import { test, expect } from "@playwright/experimental-ct-react"
import App from "./app"
import fs from "fs/promises"

test("should have title", async ({ mount }) => {
  const component = await mount(<App />)
  await expect(component).toContainText(
    "Find problems with text in your PDF file",
  )
})

test("should show PDF text content, lint errors, and lint rules", async ({
  mount,
}) => {
  const component = await mount(<App />)

  const fileInput = component.getByLabel("PDFファイルを選択")
  await fileInput.waitFor({ state: "visible" })

  const pdfFile = await fs.readFile("src/__tests__/example.pdf")
  await fileInput.setInputFiles({
    name: "loremipsum.pdf",
    mimeType: "application/pdf",
    buffer: pdfFile,
  })

  // should show text in PDF
  const pageIndicator = component.getByText("page 1 of 1:")
  await pageIndicator.waitFor({ state: "visible" })
  expect(component.getByText("メロスは激怒した。")).toBeVisible()

  // should show lint errors
  const errorCount = component.getByText("6 error")
  await errorCount.waitFor({ state: "visible" })
  expect(component.getByText('文末が"。"で終わっていません。')).toHaveCount(20)

  // should show lint rules
  const ruleName = component.getByText(
    "ja-technical-writing/ja-no-mixed-period",
  )
  await expect(ruleName).toBeVisible()
})
