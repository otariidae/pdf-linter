import React, { Fragment, memo, FunctionComponent } from "react"
import { TextlintResult, TextlintMessage } from "@textlint/kernel"
import { LintResult, LintResultPerPage, State } from "../type"
import { connect } from "react-redux"
import { toggleVisibilityFilter } from "../actions"
import { Action } from "typescript-fsa";

const removeDuplicateArray = (arr: any[]) => [...new Set(arr)]

const getTextlintRuleId = (lintResults: LintResult) =>
  lintResults.flatMap(lintResultPerPage =>
    lintResultPerPage.flatMap(result =>
      result.messages.map(message => message.ruleId)
    )
  )

const FilterForm: FunctionComponent<{
  lintResults: LintResult
  toggleVisibilityFilter: (ruleId: string) => Action<string>
}> = ({ lintResults, toggleVisibilityFilter }) => (
  <Fragment>
    <p>除外する:</p>
    {removeDuplicateArray(getTextlintRuleId(lintResults)).map((ruleId, i) => (
      <Fragment key={i}>
        <input
          type="checkbox"
          value={ruleId}
          name="select-filter-rule[]"
          onClick={() => toggleVisibilityFilter(ruleId)}
        />
        <label>{ruleId}</label>
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
  <Fragment>
    {lintResults.map((resultPerPage, i) => (
      <PageLintResultViewer resultPerPage={resultPerPage} index={i} key={i} />
    ))}
  </Fragment>
)

const getFilteredLintResults = (state: State) =>
  state.lintResults.map(lintResultPerPage =>
    lintResultPerPage.map(result =>
      Object.assign({}, result, {
        messages: result.messages.filter(
          message => !state.visibilityFilter.includes(message.ruleId)
        )
      })
    )
  )

const VisibleLintResult = connect((state: State) => ({
  lintResults: getFilteredLintResults(state)
}))(LintResultViewer)

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

export default () => (
  <Fragment>
    <ConnectedFilterForm />
    <VisibleLintResult />
  </Fragment>
)
