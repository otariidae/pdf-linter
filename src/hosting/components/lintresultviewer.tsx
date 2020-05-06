import React, { FunctionComponent } from "react"
import { LintResult, State } from "../../type"
import { connect } from "react-redux"
import { css, cx } from "emotion"

type LintResultViewerProp = {
  lintResults: LintResult
}

const colBase = css`
  padding: 2px 4px;
`
const colNumber = css`
  width: 1.5em;
`
const colNumberStyle = cx(colBase, colNumber)
const tableStyle = css`
  table-layuot: fixed;
  width: 100%;
`

const LintResultViewer: FunctionComponent<LintResultViewerProp> = ({
  lintResults,
}) => (
  <table className={tableStyle}>
    <colgroup>
      <col className={colNumberStyle} />
      <col className={colNumberStyle} />
      <col className={colNumberStyle} />
      <col className={colBase} />
    </colgroup>
    <thead>
      <tr>
        <th>ページ</th>
        <th>行</th>
        <th>列</th>
        <th>事項</th>
      </tr>
    </thead>
    <tbody>
      {lintResults.map((message, i) => (
        <tr key={i}>
          <td>{message.page}</td>
          <td>{message.line}</td>
          <td>{message.column}</td>
          <td>{message.message}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

const getFilteredLintResults = (state: State) => {
  console.log(state)
  if (state.soloFilter.length > 0) {
    return state.lintResults.filter((message) =>
      state.soloFilter.includes(message.ruleId)
    )
  }
  return state.lintResults.filter(
    (message) => !state.visibilityFilter.includes(message.ruleId)
  )
}

export default connect((state: State) => ({
  lintResults: getFilteredLintResults(state),
}))(LintResultViewer)
