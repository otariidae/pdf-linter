import { Box, Button, Flex, Link, Text } from "@radix-ui/themes"
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

const formatMessageLocation = (message: LintMessage) =>
  `[Pg ${message.page}, Ln ${message.loc.start.line}, Col ${message.loc.start.column}]`

interface LintMessageItemProps {
  message: LintMessage
  muteRule: (ruleId: string) => void
}

const LintMessageItem: FC<LintMessageItemProps> = ({ message, muteRule }) => (
  <Flex
    gap="2"
    py="2"
    style={{
      display: "grid",
      gridTemplateColumns: "1.75rem 1fr",
      gridTemplateAreas: '"icon content"',
    }}
  >
    <Box style={{ gridArea: "icon" }}>
      <SeverityIcon severity={message.severity} />
    </Box>
    <Box style={{ gridArea: "content" }}>
      <Text as="p" style={{ margin: 0 }}>
        {message.message}
        <Link
          href={`#p${message.page}-l${message.loc.start.line}`}
          style={{ marginInlineStart: "0.5em", fontSize: "0.8rem" }}
        >
          {formatMessageLocation(message)}
        </Link>
      </Text>
      <Text as="p" style={{ margin: 0 }}>
        <Text as="span" style={{ color: "#333", fontSize: "0.8em" }}>
          {message.ruleId}
        </Text>
        <Button
          variant="ghost"
          size="1"
          title={`mute ${message.ruleId} rule`}
          onClick={() => muteRule(message.ruleId)}
          style={{
            cursor: "pointer",
            marginInlineStart: "0.5em",
          }}
        >
          mute this rule
        </Button>
      </Text>
    </Box>
  </Flex>
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
    <Box>
      <Flex
        asChild
        style={{
          display: "flex",
          listStyle: "none",
          paddingInlineStart: 0,
          fontSize: "0.8rem",
        }}
      >
        <ul>
          {Object.entries(stats).map(([severity, count], index) => (
            <Text asChild key={severity}>
              <li>
                {index > 0 && ", "}
                {formatSevertyCount(
                  severity as unknown as TextlintRuleSeverityLevel,
                  count,
                )}
              </li>
            </Text>
          ))}
        </ul>
      </Flex>
      <Box
        asChild
        style={{
          listStyleType: "none",
          marginBlock: 0,
          paddingInlineStart: 0,
        }}
      >
        <ul>
          {Array.from(mutedRuleIds).map((ruleId) => (
            <li key={ruleId}>
              <Chip
                body={ruleId}
                closeButtonTitle={`unmute ${ruleId} rule`}
                onCloseClick={() => unmuteRule(ruleId)}
              />
            </li>
          ))}
        </ul>
      </Box>
      <Box
        asChild
        style={{
          listStyleType: "none",
          marginBlock: 0,
          paddingInlineStart: 0,
        }}
      >
        <ol>
          {lintResult.map((message, i) => (
            <li key={i}>
              <LintMessageItem message={message} muteRule={muteRule} />
            </li>
          ))}
        </ol>
      </Box>
    </Box>
  )
}

export default LintResultViewer
