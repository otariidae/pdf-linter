import type { TextlintRuleSeverityLevel } from "@textlint/types"
import type { FC } from "react"

const severityTextMap: Record<TextlintRuleSeverityLevel, string> = {
  0: "info",
  1: "warning",
  2: "error",
}

interface LintStatsProps {
  lintStats: Record<TextlintRuleSeverityLevel, number>
}

const LintStats: FC<LintStatsProps> = ({ lintStats }) => (
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
