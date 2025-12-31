import { Provider } from "jotai"
import { expect, test } from "vitest"
import { render } from "vitest-browser-react"
import App from "./app"

test("should have title", async () => {
  const { getByText } = await render(
    <Provider>
      <App />
    </Provider>,
  )
  await expect
    .element(getByText("Find problems with text in your PDF file"))
    .toBeInTheDocument()
})

test("should show PDF text content, lint errors, and lint rules", async () => {
  const { getByLabelText, getByText } = await render(
    <Provider>
      <App />
    </Provider>,
  )

  const fileInput = getByLabelText(/PDFファイルを選択/)
  await expect.element(fileInput).toBeInTheDocument()

  await fileInput.upload("src/__tests__/example.pdf")

  // should show text in PDF
  const pageIndicator = getByText("Page 1 of 1")
  await expect.element(pageIndicator).toBeVisible()
  await expect.element(getByText("そういう可能性もなくもない.")).toBeVisible()
  await expect
    .element(getByText("最近のＡＩは⾰命的で、魔法のように動作する。"))
    .toBeVisible()

  // should show lint errors
  const errorCount = getByText("7 errors")
  await expect.element(errorCount).toBeVisible()

  await expect.element(getByText("二重否定: 〜なくもない")).toBeVisible()
  const noDoubleNegativeRule = getByText(
    "ja-technical-writing/no-double-negative-ja",
  )
  await expect.element(noDoubleNegativeRule).toBeVisible()

  await expect.element(getByText("Found kangxi radical: ⾰")).toBeVisible()
  const noKangxiRadicalsRule = getByText("japanese/no-kangxi-radicals")
  await expect.element(noKangxiRadicalsRule).toBeVisible()

  await expect
    .element(
      getByText(
        "「魔法のように」という比喩的表現は現実味に欠ける可能性があります。具体的な仕組みを説明することを検討してください。",
      ),
    )
    .toBeVisible()
  const noHypeExpressionRule = getByText(
    "@textlint-ja/ai-writing/no-ai-hype-expressions",
  )
  await expect.element(noHypeExpressionRule).toBeVisible()
})

test("should omit lint errors for muted rules", async () => {
  const { getByLabelText, getByText, getByTitle } = await render(
    <Provider>
      <App />
    </Provider>,
  )

  const fileInput = getByLabelText(/PDFファイルを選択/)
  await expect.element(fileInput).toBeInTheDocument()

  await fileInput.upload("src/__tests__/example.pdf")

  // apply mute filter
  const noDoubleNegativeRuleMuteButton = getByTitle(
    "mute ja-technical-writing/no-double-negative-ja rule",
  )
  await noDoubleNegativeRuleMuteButton.click()

  // should omit lint errors for muted rules
  await expect.element(getByText("6 errors")).toBeVisible()
  await expect
    .element(getByText("二重否定: 〜なくもない"))
    .not.toBeInTheDocument()
  await expect.element(getByText("Found kangxi radical: ⾰")).toBeVisible()
  await expect
    .element(
      getByText(
        "「魔法のように」という比喩的表現は現実味に欠ける可能性があります。具体的な仕組みを説明することを検討してください。",
      ),
    )
    .toBeVisible()

  // unmute the rule
  const noDoubleNegativeRuleUnmuteButton = getByTitle(
    "unmute ja-technical-writing/no-double-negative-ja rule",
  )
  await noDoubleNegativeRuleUnmuteButton.click()

  // should show lint errors for unmuted rules
  await expect.element(getByText("7 errors")).toBeVisible()
  await expect.element(getByText("二重否定: 〜なくもない")).toBeVisible()
})
