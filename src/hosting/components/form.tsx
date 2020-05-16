import React, { ChangeEvent, Fragment, FunctionComponent } from "react"
import {
  onFileInput,
  onLintFinished,
  toggleSoloFilter,
  toggleVisibilityFilter,
} from "../actions"
import { lintPDFFile } from "../../pdf"
import { useDispatch, useSelector } from "react-redux"
import { TextlintMessage } from "@textlint/kernel"
import { LintResult, State } from "../../type"

const removeDuplicateArray = (arr: any[]) => [...new Set(arr)]

const getTextlintRuleId = (lintResults: LintResult) =>
  removeDuplicateArray(
    lintResults.map((message: TextlintMessage) => message.ruleId)
  )

const FilterForm: FunctionComponent<{}> = () => {
  const lintResults = useSelector((state: State) => state.lintResults)
  const dispatch = useDispatch()
  return (
    <Fragment>
      <p>除外する:</p>
      <ul>
        {getTextlintRuleId(lintResults).map((ruleId, i) => (
          <li key={i}>
            <input
              type="checkbox"
              value={ruleId}
              onClick={() => dispatch(toggleVisibilityFilter(ruleId))}
            />
            <input
              type="checkbox"
              value={ruleId}
              onClick={() => dispatch(toggleSoloFilter(ruleId))}
            />
            <span>{ruleId}</span>
          </li>
        ))}
      </ul>
    </Fragment>
  )
}

export const ConnectedFilterForm = FilterForm

const Form = () => {
  const dispatch = useDispatch()
  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        aria-label="PDFファイルを選択"
        onChange={async (event: ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files[0]
          dispatch(onFileInput({ file }))
          const lintResults = await lintPDFFile(file)
          dispatch(onLintFinished({ lintResults }))
        }}
      />
      <ConnectedFilterForm />
    </div>
  )
}

export default Form
