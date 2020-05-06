import { TextLintEngine } from "textlint"
import { forEachPage, getPDFDocNodeJS, getTextFromPage } from "../pdf"
import { TextlintResult, TextlintMessage } from "@textlint/kernel"
import produce from "immer"
import { LintMessage, LintResult } from "../type"
import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"

// dummy import to make sure @netlify/zip-it-and-ship-it includes them in node_modules
// @ts-ignore
import presetJaTechWriting from "textlint-rule-preset-ja-technical-writing"
// @ts-ignore
import presetJapanese from "textlint-rule-preset-japanese"
// dummy console.log to avoid dead code elimination
console.log(presetJaTechWriting)
console.log(presetJapanese)

const textlintOption = {
  presets: [
    "textlint-rule-preset-japanese",
    "textlint-rule-preset-ja-technical-writing",
  ],
  rules: ["prh"],
  rulesConfig: {
    prh: {
      rulePaths: [
        "/var/task/src/node_modules/prh/prh-rules/media/techbooster.yml",
        "/var/task/src/node_modules/prh/prh-rules/media/WEB+DB_PRESS.yml",
      ],
    },
  },
  formatterName: "pretty-error",
}
export const handler: APIGatewayProxyHandler = async function handler(
  event,
  context
) {
  if (event.httpMethod !== "POST") {
    return cors({
      statusCode: 405,
      body: "",
    })
  }
  try {
    const engine = new TextLintEngine(textlintOption)
    const body = Buffer.from(
      event.body.replace(/^data:application\/pdf;base64,/, ""),
      "base64"
    )
    const doc = await getPDFDocNodeJS(body)
    const pages = await Promise.all(forEachPage(doc))
    let results: LintResult = []
    for (const [i, page] of pages.entries()) {
      const text = await getTextFromPage(page)
      const textlintResult = await engine.executeOnText(text)
      const messages: TextlintMessage[] = textlintResult.flatMap(
        (result: TextlintResult) => result.messages
      )
      const lintMessages: LintMessage[] = produce(
        messages,
        (messages: LintMessage[]) => {
          for (const message of messages) {
            message.page = i + 1
          }
          return messages
        }
      )
      results = results.concat(lintMessages)
    }
    return cors({
      statusCode: 200,
      body: JSON.stringify(results),
    })
  } catch (err) {
    return cors({ statusCode: 500, body: err.toString() })
  }
}

const cors = (result: APIGatewayProxyResult): APIGatewayProxyResult => {
  result.headers = result.headers || {}
  result.headers["Access-Control-Allow-Origin"] = "*"
  return result
}
