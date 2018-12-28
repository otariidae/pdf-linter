import Koa, { Context } from "koa"
const app = new Koa()
const { post } = require("koa-route")
import multer, { MulterIncomingMessage } from "koa-multer"
const logger = require("koa-logger")
const serve = require("koa-static")
const compose = require("koa-compose")
const { TextLintEngine } = require("textlint")
import { forEachPage, getPDFDocNodeJS, getTextFromPage } from "./src/pdf"
import { LintResult, LintResultPerPage } from "./src/type"

const textlintOption = {
  presets: [
    "textlint-rule-preset-japanese",
    "textlint-rule-preset-ja-technical-writing"
  ],
  formatterName: "pretty-error"
}
const engine = new TextLintEngine(textlintOption)

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.use(logger())

app.use(
  post(
    "/lint",
    compose([
      upload.single("file"),
      async (ctx: Context) => {
        const file = (ctx.req as MulterIncomingMessage).file
        const doc = await getPDFDocNodeJS(file.buffer)
        const results: LintResult = []
        for (const _page of forEachPage(doc)) {
          const page = await _page
          const text = await getTextFromPage(page)
          const result: LintResultPerPage = await engine.executeOnText(text)
          results.push(result)
        }
        ctx.body = results
      }
    ])
  )
)

app.use(serve("./dist"))

app.listen(18081)

module.exports = app
