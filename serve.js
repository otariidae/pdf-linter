const Koa = require("koa")
const app = new Koa()
const { get, post } = require("koa-route")
const bodyparser = require("koa-bodyparser")
const logger = require("koa-logger")
const static = require("koa-static")
const { TextLintEngine } = require("textlint")

const textlintOption = {
  presets: [
    "textlint-rule-preset-japanese",
    "textlint-rule-preset-ja-technical-writing"
  ],
  formatterName: "pretty-error"
}
const engine = new TextLintEngine(textlintOption)

app.use(
  bodyparser({
    enableTypes: ["text"]
  })
)
app.use(logger())

app.use(
  post("/lint", async ctx => {
    const results = await engine.executeOnText(ctx.request.body)
    for (const result of results) {
      console.log(result.messages)
    }
    ctx.body = results
  })
)

app.use(static("./dist"))

app.listen(18081)

module.exports = app
