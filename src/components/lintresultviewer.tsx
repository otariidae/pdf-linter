import React, { Fragment, memo, FunctionComponent } from "react"
import { TextlintResult, TextlintMessage } from "@textlint/kernel"
import { LintResult, LintResultPerPage } from "../type"

type LintResultViewerProp = {
  lintResults: LintResult
}

const LintResultViewer: FunctionComponent<LintResultViewerProp> = memo(
  ({ lintResults }) => (
    <Fragment>
      {lintResults.map((resultPerPage, i) => (
        <PageLintResultViewer resultPerPage={resultPerPage} index={i} key={i} />
      ))}
    </Fragment>
  )
)

type PageLintResultViewerProp = {
  resultPerPage: LintResultPerPage
  index: number
}

const PageLintResultViewer: FunctionComponent<PageLintResultViewerProp> = memo(
  ({ resultPerPage, index: i }) => (
    <Fragment>
      <p>ページ {i + 1}</p>
      <ul>
        {resultPerPage.map((result: TextlintResult, i) => (
          <TextlintResultViewer result={result} key={i} />
        ))}
      </ul>
    </Fragment>
  )
)

type TextlintResultViewerProp = {
  result: TextlintResult
}

const TextlintResultViewer: FunctionComponent<TextlintResultViewerProp> = ({
  result
}) => (
  <Fragment>
    {result.messages.map(formatLintMessage).map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </Fragment>
)

const formatLintMessage = (message: TextlintMessage) =>
  `行: ${message.line} 列: ${message.column}: ${message.message}`

export default LintResultViewer
