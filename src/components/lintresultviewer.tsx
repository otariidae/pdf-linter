import React, { Fragment, FunctionComponent } from "react"
import { TextlintMessage } from "@textlint/kernel"
import { LintResult, State } from "../type"
import { connect } from "react-redux"
import { toggleVisibilityFilter } from "../actions"
import { Action } from "typescript-fsa"

const removeDuplicateArray = (arr: any[]) => [...new Set(arr)]

const getTextlintRuleId = (lintResults: LintResult) =>
  removeDuplicateArray(
    lintResults.map((message: TextlintMessage) => message.ruleId)
  )

const FilterForm: FunctionComponent<{
  lintResults: LintResult
  toggleVisibilityFilter: (ruleId: string) => Action<string>
}> = ({ lintResults, toggleVisibilityFilter }) => (
  <Fragment>
    <p>除外する:</p>
    {getTextlintRuleId(lintResults).map((ruleId, i) => (
      <Fragment key={i}>
        <input
          type="checkbox"
          value={ruleId}
          id={ruleId}
          name="select-filter-rule[]"
          onClick={() => toggleVisibilityFilter(ruleId)}
        />
        <label htmlFor={ruleId}>{ruleId}</label>
      </Fragment>
    ))}
  </Fragment>
)

const mapDispatchToProps = {
  toggleVisibilityFilter: toggleVisibilityFilter
}

const ConnectedFilterForm = connect(
  (state: State) => ({
    lintResults: state.lintResults
  }),
  mapDispatchToProps
)(FilterForm)

type LintResultViewerProp = {
  lintResults: LintResult
}

const LintResultViewer: FunctionComponent<LintResultViewerProp> = ({
  lintResults
}) => (
  <table style={{ listStyleType: "none" }}>
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

const getFilteredLintResults = (state: State) =>
  state.lintResults.filter(
    message => !state.visibilityFilter.includes(message.ruleId)
  )

const VisibleLintResult = connect((state: State) => ({
  lintResults: getFilteredLintResults(state)
}))(LintResultViewer)

export default () => (
  <Fragment>
    <ConnectedFilterForm />
    <VisibleLintResult />
  </Fragment>
)
