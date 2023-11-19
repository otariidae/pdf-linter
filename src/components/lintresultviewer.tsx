import { css } from "@emotion/css"
import type { VFC } from "react"
import type { LintMessage } from "../type"

const tableStyle = css`
  table-layuot: fixed;
  width: 100%;

  th,
  td {
    padding: 2px 4px;

    &:nth-child(-n + 3) {
      width: 1.5em;
    }
  }
`

interface LintResultViewerProps {
  lintResult: LintMessage[]
}
const LintResultViewer: VFC<LintResultViewerProps> = ({ lintResult }) => (
  <table className={tableStyle}>
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
          <td>
            <a href={`#p${message.page}-l${message.line}`}>{message.line}</a>
          </td>
          <td>{message.column}</td>
          <td>{message.message}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default LintResultViewer
