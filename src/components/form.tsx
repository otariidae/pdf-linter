import React, {
  ChangeEvent,
  Component,
  Fragment,
  FunctionComponent
} from "react"
import {
  onFileInput,
  onLintFinished,
  toggleSoloFilter,
  toggleVisibilityFilter
} from "../actions"
import { lintPDFFile } from "../pdf"
import { connect } from "react-redux"
import { TextlintMessage } from "@textlint/kernel"
import { LintResult, State } from "../type"
import { Action } from "typescript-fsa"

const removeDuplicateArray = (arr: any[]) => [...new Set(arr)]

const getTextlintRuleId = (lintResults: LintResult) =>
  removeDuplicateArray(
    lintResults.map((message: TextlintMessage) => message.ruleId)
  )

const FilterForm: FunctionComponent<{
  lintResults: LintResult
  toggleVisibilityFilter: (ruleId: string) => Action<string>
  toggleSoloFilter: (ruleId: string) => Action<string>
}> = ({ lintResults, toggleVisibilityFilter, toggleSoloFilter }) => (
  <Fragment>
    <p>除外する:</p>
    <ul>
      {getTextlintRuleId(lintResults).map((ruleId, i) => (
        <li key={i}>
          <input
            type="checkbox"
            value={ruleId}
            onClick={() => toggleVisibilityFilter(ruleId)}
          />
          <input
            type="checkbox"
            value={ruleId}
            onClick={() => toggleSoloFilter(ruleId)}
          />
          <span>{ruleId}</span>
        </li>
      ))}
    </ul>
  </Fragment>
)

export const ConnectedFilterForm = connect(
  (state: State) => ({
    lintResults: state.lintResults
  }),
  {
    toggleVisibilityFilter: toggleVisibilityFilter,
    toggleSoloFilter: toggleSoloFilter
  }
)(FilterForm)

type FormProp = {
  onFileInput: (obj: { file: File }) => any
  onLintFinished: (obj: { lintResults: LintResult }) => any
}

class Form extends Component<FormProp> {
  constructor(props: FormProp) {
    super(props)
    this.onFileInput = this.onFileInput.bind(this)
  }
  private async onFileInput(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files[0]
    this.props.onFileInput({ file })
    const lintResults = await lintPDFFile(file)
    this.props.onLintFinished({ lintResults })
  }
  render() {
    return (
      <div>
        <input
          type="file"
          accept="application/pdf"
          onChange={this.onFileInput}
        />
        <ConnectedFilterForm />
      </div>
    )
  }
}

const mapDispatchToProps = {
  onFileInput,
  onLintFinished
}

export default connect(
  null,
  mapDispatchToProps
)(Form)
