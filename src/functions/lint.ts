import { TextLintEngine } from "textlint"
import { TextlintMessage, TextlintResult } from "@textlint/kernel"
import { LintMessage, LintResult } from "../type"
import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"

// dummy import to make sure @netlify/zip-it-and-ship-it includes them in node_modules
// @ts-ignore
import presetJaTechWriting from "textlint-rule-preset-ja-technical-writing"
// @ts-ignore
import presetJapanese from "textlint-rule-preset-japanese"
import "web-streams-polyfill/ponyfill"
// dummy console.log to avoid dead code elimination
console.log(presetJaTechWriting)
console.log(presetJapanese)

console.log("NODE_ENV:", process.env.NODE_ENV)
const NODE_MODULES_PATH =
  process.env.NODE_ENV === "development"
    ? "./node_modules"
    : "/var/task/src/node_modules"

const textlintOption = {
  presets: [
    "textlint-rule-preset-japanese",
    "textlint-rule-preset-ja-technical-writing",
  ],
  rules: ["prh"],
  rulesConfig: {
    prh: {
      rulePaths: [
        `${NODE_MODULES_PATH}/prh/prh-rules/media/techbooster.yml`,
        `${NODE_MODULES_PATH}/prh/prh-rules/media/WEB+DB_PRESS.yml`,
      ],
    },
  },
  formatterName: "pretty-error",
}
const engine = new TextLintEngine(textlintOption)

export const handler: APIGatewayProxyHandler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "",
    }
  }
  try {
    const textList: string[] = JSON.parse(event.body)
    const textlintResults = await Promise.all(
      textList.map((text) => lintPageText(text))
    )
    const lintResult: LintResult = textlintResults
      .map((textlintMessages, i) =>
        textlintMessages.map(textlintMessage2lintMessageCreator(i + 1))
      )
      .reduce((a, b) => a.concat(b), [] as LintMessage[])
    return {
      statusCode: 200,
      body: JSON.stringify(lintResult),
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}

const lintPageText = async (text: string): Promise<TextlintMessage[]> => {
  const textlintResult = await engine.executeOnText(text)
  const messages = textlintResult.flatMap(
    (result: TextlintResult) => result.messages
  )
  return messages
}

const textlintMessage2lintMessageCreator = (pageNumber: number) => (
  textlintMessage: TextlintMessage
): LintMessage => ({
  ...textlintMessage,
  page: pageNumber,
})
