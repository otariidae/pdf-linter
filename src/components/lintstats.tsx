import type { TextlintRuleSeverityLevel } from "@textlint/types"
import type { FC } from "react"

const severityTextMap: Record<
  TextlintRuleSeverityLevel,
  [singular: string, plural: string]
> = {
  0: ["info", "infos"],
  1: ["warning", "warnings"],
  2: ["error", "errors"],
}

const pluralRules = new Intl.PluralRules("en")

function pluralize(count: number, singular: string, plural: string) {
  const pluralCategory = pluralRules.select(count)
  switch (pluralCategory) {
    case "one":
      return singular
    default:
      return plural
  }
}

interface LintStatsProps {
  lintStats: Record<TextlintRuleSeverityLevel, number>
}

const LintStats: FC<LintStatsProps> = ({ lintStats }) => (
  <ul>
    {Object.entries(lintStats).map(([severity, count]) => (
      <li key={severity}>
        {count}{" "}
        {pluralize(
          count,
          ...severityTextMap[severity as unknown as TextlintRuleSeverityLevel],
        )}
      </li>
    ))}
  </ul>
)

export default LintStats
