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
      <p>Rules</p>
      <table>
        <thead>
          <th>Mute</th>
          <th>Solo</th>
          <th>Rule Name</th>
        </thead>
        <tbody>
          {getTextlintRuleId(lintResult).map((ruleId, i) => (
            <tr key={i}>
              <td>
                <input
                  type="checkbox"
                  title="Mute this rule"
                  disabled={soloFilter.size > 0}
                  checked={visibilityFilter.has(ruleId)}
                  onClick={() => toggleVisibilityFilter(ruleId)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  title="Solo this rule"
                  checked={soloFilter.has(ruleId)}
                  onClick={() => toggleSoloFilter(ruleId)}
                />
              </td>
              <td>{ruleId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  )
}

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
      <FilterForm />
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
