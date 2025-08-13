import fs from "node:fs/promises"
import { expect, test } from "@playwright/experimental-ct-react"
import App from "./app"

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
    name: "example.pdf",
    mimeType: "application/pdf",
    buffer: pdfFile,
  })

  // should show text in PDF
  const pageIndicator = component.getByText("page 1 of 1:")
  await pageIndicator.waitFor({ state: "visible" })
  expect(component.getByText("そういう可能性もなくもない.")).toBeVisible()
  expect(
    component.getByText("最近のＡＩは⾰命的で、魔法のように動作する。"),
  ).toBeVisible()

  // should show lint errors
  const errorCount = component.getByText("7 errors")
  await errorCount.waitFor({ state: "visible" })

  expect(component.getByText("二重否定: 〜なくもない")).toBeVisible()
  const noDoubleNegativeRule = component.getByText(
    "ja-technical-writing/no-double-negative-ja",
  )
  await expect(noDoubleNegativeRule).toBeVisible()

  expect(component.getByText("Found kangxi radical: ⾰")).toBeVisible()
  const noKangxiRadicalsRule = component.getByText(
    "japanese/no-kangxi-radicals",
  )
  await expect(noKangxiRadicalsRule).toBeVisible()

  expect(
    component.getByText(
      "「魔法のように」という比喩的表現は現実味に欠ける可能性があります。具体的な仕組みを説明することを検討してください。",
    ),
  ).toBeVisible()
  const noHypeExpressionRule = component.getByText(
    "@textlint-ja/ai-writing/no-ai-hype-expressions",
  )
  await expect(noHypeExpressionRule).toBeVisible()
})

test("should omit lint errors for muted rules", async ({ mount }) => {
  const component = await mount(<App />)

  const fileInput = component.getByLabel("PDFファイルを選択")
  await fileInput.waitFor({ state: "visible" })

  const pdfFile = await fs.readFile("src/__tests__/example.pdf")
  await fileInput.setInputFiles({
    name: "example.pdf",
    mimeType: "application/pdf",
    buffer: pdfFile,
  })

  // apply mute filter
  const noDoubleNegativeRuleMuteButton = component.getByTitle(
    "mute ja-technical-writing/no-double-negative-ja rule",
  )
  await noDoubleNegativeRuleMuteButton.click()

  // should omit lint errors for muted rules
  await component.getByText("6 errors").waitFor({ state: "visible" })
  expect(component.getByText("二重否定: 〜なくもない")).not.toBeVisible()
  expect(component.getByText("Found kangxi radical: ⾰")).toBeVisible()
  expect(
    component.getByText(
      "「魔法のように」という比喩的表現は現実味に欠ける可能性があります。具体的な仕組みを説明することを検討してください。",
    ),
  ).toBeVisible()

  // unmute the rule
  const noDoubleNegativeRuleUnmuteButton = component.getByTitle(
    "unmute ja-technical-writing/no-double-negative-ja rule",
  )
  await noDoubleNegativeRuleUnmuteButton.click()

  // should show lint errors for unmuted rules
  await component.getByText("7 errors").waitFor({ state: "visible" })
  expect(component.getByText("二重否定: 〜なくもない")).toBeVisible()
})
