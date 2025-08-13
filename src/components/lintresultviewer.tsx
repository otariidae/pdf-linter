import { css } from "@emotion/css"
import type { TextlintRuleSeverityLevel } from "@textlint/kernel"
import type { FC } from "react"
import { pluralize } from "../pluralize"
import type { LintMessage } from "../type"
import { Chip } from "./chip"
import { SeverityIcon } from "./severityicon"

const severityTextMap: Record<
  TextlintRuleSeverityLevel,
  [singular: string, plural: string]
> = {
  0: ["info", "infos"],
  1: ["warning", "warnings"],
  2: ["error", "errors"],
}

function calculateStats(lintResult: LintMessage[]) {
  const stats: Record<TextlintRuleSeverityLevel, number> = {
    0: 0,
    1: 0,
    2: 0,
  }
  for (const message of lintResult) {
    stats[message.severity]++
  }
  return stats
}

const statsListStyle = css`
  display: flex;
  list-style: none;
  padding-inline-start: 0;
  font-size: 0.8rem;

  > li:not(:first-child)::before {
    content: ", ";
  }
`

const mutedRuleListStyle = css`
  list-style-type: none;
  margin-block: 0;
  padding-inline-start: 0;
`

const lintMessageListStyle = css`
  list-style-type: none;
  margin-block: 0;
  padding-inline-start: 0;
`

const lintMessageContentStyle = css`
  > p {
    margin: 0;
  }
`

const lineLinkStyle = css`
  margin-inline-start: 0.5em;
  font-size: 0.8rem;
`

const ruleIdStyle = css`
  color: #333;
  font-size: 0.8em;
`

const muteButtonStyle = css`
  background-color: transparent;
  border: none;
  cursor: pointer;
`

const formatMessageLocation = (message: LintMessage) =>
  `[Pg ${message.page}, Ln ${message.loc.start.line}, Col ${message.loc.start.column}]`

const lintMessageItemStyle = css`
  display: grid;
  padding-block: 0.625rem;
  grid-template-columns: 1.75rem 1fr;
  grid-template-areas: "icon content";
`

interface LintMessageItemProps {
  message: LintMessage
  muteRule: (ruleId: string) => void
}

const LintMessageItem: FC<LintMessageItemProps> = ({ message, muteRule }) => (
  <div className={lintMessageItemStyle}>
    <div style={{ gridArea: "icon" }}>
      <SeverityIcon severity={message.severity} />
    </div>
    <div style={{ gridArea: "content" }} className={lintMessageContentStyle}>
      <p>
        {message.message}
        <a
          className={lineLinkStyle}
          href={`#p${message.page}-l${message.loc.start.line}`}
        >
          {formatMessageLocation(message)}
        </a>
      </p>
      <p>
        <span className={ruleIdStyle}>{message.ruleId}</span>
        <button
          type="button"
          title={`mute ${message.ruleId} rule`}
          className={muteButtonStyle}
          onClick={() => muteRule(message.ruleId)}
        >
          mute this rule
        </button>
      </p>
    </div>
  </div>
)

const formatSevertyCount = (
  severity: TextlintRuleSeverityLevel,
  count: number,
) => `${count} ${pluralize(count, ...severityTextMap[severity])}`

interface LintResultViewerProps {
  lintResult: LintMessage[]
  mutedRuleIds: Set<string>
  muteRule: (ruleId: string) => void
  unmuteRule: (ruleId: string) => void
}

const LintResultViewer: FC<LintResultViewerProps> = ({
  lintResult,
  mutedRuleIds,
  muteRule,
  unmuteRule,
}) => {
  const stats = calculateStats(lintResult)
  return (
    <>
      <ul className={statsListStyle}>
        {Object.entries(stats).map(([severity, count]) => (
          <li key={severity}>
            {formatSevertyCount(
              severity as unknown as TextlintRuleSeverityLevel,
              count,
            )}
          </li>
        ))}
      </ul>
      <ul className={mutedRuleListStyle}>
        {Array.from(mutedRuleIds).map((ruleId) => (
          <li key={ruleId}>
            <Chip body={ruleId} onCloseClick={() => unmuteRule(ruleId)} />
          </li>
        ))}
      </ul>
      <ol className={lintMessageListStyle}>
        {lintResult.map((message, i) => (
          <li key={i}>
            <LintMessageItem message={message} muteRule={muteRule} />
          </li>
        ))}
      </ol>
    </>
  )
}

export default LintResultViewer
