import React, { ChangeEvent, Fragment, FunctionComponent } from "react"
import { lintPDFFile } from "../../pdf"
import { TextlintMessage } from "@textlint/kernel"
import { LintResult } from "../../type"
import {
  fileState,
  lintResultState,
  soloFilterState,
  visibilityFilterState,
} from "../states"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"

function removeDuplicateArray<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

const getTextlintRuleId = (lintResults: LintResult) =>
  removeDuplicateArray(
    lintResults.map((message: TextlintMessage) => message.ruleId)
  )

const FilterForm: FunctionComponent<{}> = () => {
  const lintResult = useRecoilValue(lintResultState)
  const [visibilityFilter, setVisibilityFilter] = useRecoilState(
    visibilityFilterState
  )
  const [soloFilter, setSoloFilter] = useRecoilState(soloFilterState)
  const toggleVisibilityFilter = (ruleId: string) => {
    const newVisibilityFilter = new Set(visibilityFilter)
    toggleSet(newVisibilityFilter, ruleId)
    setVisibilityFilter(newVisibilityFilter)
  }
  const toggleSoloFilter = (ruleId: string) => {
    const newSoloFilter = new Set(soloFilter)
    toggleSet(newSoloFilter, ruleId)
    setSoloFilter(newSoloFilter)
  }
  return (
    <Fragment>
      <p>除外する:</p>
      <ul>
        {getTextlintRuleId(lintResult).map((ruleId, i) => (
          <li key={i}>
            <input
              type="checkbox"
              value={ruleId}
              checked={visibilityFilter.has(ruleId)}
              onClick={() => toggleVisibilityFilter(ruleId)}
            />
            <input
              type="checkbox"
              value={ruleId}
              checked={soloFilter.has(ruleId)}
              onClick={() => toggleSoloFilter(ruleId)}
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
  const setFile = useSetRecoilState(fileState)
  const setLintResult = useSetRecoilState(lintResultState)
  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        aria-label="PDFファイルを選択"
        onChange={async (event: ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files[0]
          setFile(file)
          const lintResult = await lintPDFFile(file)
          setLintResult(lintResult)
        }}
      />
      <ConnectedFilterForm />
    </div>
  )
}

export default Form

function toggleSet<T>(set: Set<T>, item: T) {
  if (set.has(item)) {
    set.delete(item)
  } else {
    set.add(item)
  }
  return set
}
