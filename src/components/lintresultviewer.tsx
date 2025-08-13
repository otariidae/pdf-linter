import { css } from "@emotion/css"
import type { TextlintRuleSeverityLevel } from "@textlint/kernel"
import type { FC } from "react"
import type { LintMessage } from "../type"

const mutedRuleListStyle = css`
  list-style-type: none;
  margin-block: 0;
  padding-inline-start: 0;
`

const chipStyle = css`
  display: inline-grid;
  align-items: center;
  grid-template-columns: 1fr 1.5rem;
  grid-template-areas: "content icon";
  padding: 0.2rem 0.2rem 0.2rem 0.75rem;
  border: 1px solid black;
  border-radius: 2rem;
  margin-inline-end: 0.5rem;

  > .material-symbols-outlined {
    grid-area: icon;
    padding: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
`

const chipContentStyle = css`
  grid-area: content;
  vertical-align: middle;
  font-size: 0.75rem;
`

const lintMessageListStyle = css`
  list-style-type: none;
  margin-block: 0;
  padding-inline-start: 0;
`

const lintMessageListItemStyle = css`
  display: grid;
  padding-block: 0.625rem;
  grid-template-columns: 1.75rem 1fr;
  grid-template-areas: "icon content";
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

function ServerityIcon({ severity }: { severity: TextlintRuleSeverityLevel }) {
  switch (severity) {
    case 0:
      return (
        <span
          className="material-symbols-outlined"
          style={{ color: "royalblue" }}
        >
          info
        </span>
      )
    case 1:
      return (
        <span className="material-symbols-outlined" style={{ color: "orange" }}>
          warning
        </span>
      )
    case 2:
      return (
        <span className="material-symbols-outlined" style={{ color: "red" }}>
          dangerous
        </span>
      )
  }
}

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
}) => (
  <>
    <ul className={mutedRuleListStyle}>
      {Array.from(mutedRuleIds).map((ruleId) => (
        <li key={ruleId} className={chipStyle}>
          <span className={chipContentStyle}>{ruleId}</span>
          <button
            type="button"
            title={`unmute ${ruleId} rule`}
            className="material-symbols-outlined"
            onClick={() => unmuteRule(ruleId)}
          >
            close
          </button>
        </li>
      ))}
    </ul>
    <ol className={lintMessageListStyle}>
      {lintResult.map((message, i) => (
        <li key={i} className={lintMessageListItemStyle}>
          <div style={{ gridArea: "icon" }}>
            <ServerityIcon severity={message.severity} />
          </div>
          <div
            style={{ gridArea: "content" }}
            className={lintMessageContentStyle}
          >
            <p>
              {message.message}
              <a
                className={lineLinkStyle}
                href={`#p${message.page}-l${message.loc.start.line}`}
              >
                [Pg {message.page}, Ln {message.loc.start.line}, Col{" "}
                {message.loc.start.column}]
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
        </li>
      ))}
    </ol>
  </>
)

export default LintResultViewer
