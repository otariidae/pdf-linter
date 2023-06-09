import { type VFC } from "react"
import { type TextlintRuleSeverityLevel } from "@textlint/types"

const severityTextMap: Record<TextlintRuleSeverityLevel, string> = {
  0: "info",
  1: "warning",
  2: "error",
}

interface LintStatsProps {
  lintStats: Record<TextlintRuleSeverityLevel, number>
}
const LintStats: VFC<LintStatsProps> = ({ lintStats }) => (
  <ul>
    {Object.entries(lintStats).map(([severity, count]) => (
      <li key={severity}>
        {count}{" "}
        {severityTextMap[severity as unknown as TextlintRuleSeverityLevel]}
      </li>
    ))}
  </ul>
)

export default LintStats
