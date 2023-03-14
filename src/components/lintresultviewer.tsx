import { type VFC } from "react"
import { css, cx } from "emotion"
import { filteredLintResultState } from "../states"
import { useRecoilValue } from "recoil"

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

const LintResultViewer: VFC = () => {
  const lintResult = useRecoilValue(filteredLintResultState)
  return (
    <table className={tableStyle}>
      <colgroup>
        <col className={colNumberStyle} />
        <col className={colNumberStyle} />
        <col className={colNumberStyle} />
        <col className={colBase} />
      </colgroup>
      <thead>
        <tr>
          <th>page</th>
          <th>line</th>
          <th>column</th>
          <th>message</th>
        </tr>
      </thead>
      <tbody>
        {lintResult.map((message, i) => (
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
}

export default LintResultViewer
