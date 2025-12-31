import { Box, Button, Flex, Grid, Heading, Link, Text } from "@radix-ui/themes"
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
  <Grid
    p="4"
    mb="3"
    areas={`"icon content"`}
    columns="2rem 1fr"
    style={{
      background: "var(--gray-a2)",
      border: "1px solid var(--gray-6)",
      borderRadius: "var(--radius-3)",
      transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = "var(--shadow-2)"
      e.currentTarget.style.transform = "translateX(2px)"
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "none"
      e.currentTarget.style.transform = "translateX(0)"
    }}
  >
    <Box style={{ gridArea: "icon" }}>
      <SeverityIcon severity={message.severity} />
    </Box>
    <Box style={{ gridArea: "content" }}>
      <Text
        as="p"
        m="0"
        mb="2"
        style={{
          fontSize: "0.95rem",
          lineHeight: 1.6,
          color: "var(--gray-12)",
        }}
      >
        {message.message}
      </Text>
      <Flex gap="2" align="center" mt="2" style={{ flexWrap: "wrap" }}>
        <Link
          href={`#p${message.page}-l${message.loc.start.line}`}
          style={{
            fontSize: "0.8rem",
            color: "var(--accent-11)",
            textDecoration: "none",
            fontWeight: 500,
            fontFamily: "var(--font-mono)",
            padding: "0.25rem 0.5rem",
            background: "var(--accent-a3)",
            borderRadius: "var(--radius-2)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--accent-a4)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--accent-a3)"
          }}
        >
          {formatMessageLocation(message)}
        </Link>
        <Text
          as="span"
          style={{
            color: "var(--gray-10)",
            fontSize: "0.8rem",
            fontFamily: "var(--font-mono)",
          }}
        >
          {message.ruleId}
        </Text>
        <Button
          variant="ghost"
          size="1"
          title={`mute ${message.ruleId} rule`}
          onClick={() => muteRule(message.ruleId)}
          style={{
            cursor: "pointer",
            fontSize: "0.75rem",
            color: "var(--gray-11)",
            padding: "0.25rem 0.5rem",
            height: "auto",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--accent-11)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--gray-11)"
          }}
        >
          mute
        </Button>
      </Flex>
    </Box>
  </Grid>
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
    <Box p="6">
      <Box
        mb="6"
        pb="4"
        style={{
          borderBottom: "1px solid var(--gray-6)",
        }}
      >
        <Heading
          as="h3"
          m="0"
          style={{
            fontSize: "1.25rem",
            fontFamily: "var(--font-display)",
            color: "var(--gray-12)",
            fontWeight: 700,
          }}
        >
          Lint Results
        </Heading>
        <Flex
          asChild
          mt="2"
          mb="0"
          gap="3"
          style={{
            display: "flex",
            listStyle: "none",
            paddingInlineStart: 0,
            fontSize: "0.875rem",
          }}
        >
          <ul>
            {Object.entries(stats).map(([severity, count]) => (
              <Text asChild key={severity}>
                <li
                  style={{
                    padding: "0.375rem 0.75rem",
                    background:
                      severity === "2"
                        ? "var(--red-a3)"
                        : severity === "1"
                          ? "var(--orange-a3)"
                          : "var(--blue-a3)",
                    borderRadius: "var(--radius-2)",
                    fontWeight: 600,
                    color: "var(--gray-12)",
                  }}
                >
                  {formatSevertyCount(
                    severity as unknown as TextlintRuleSeverityLevel,
                    count,
                  )}
                </li>
              </Text>
            ))}
          </ul>
        </Flex>
      </Box>
      {mutedRuleIds.size > 0 && (
        <Box
          mb="6"
          p="4"
          style={{
            background: "var(--gray-a2)",
            borderRadius: "var(--radius-3)",
            border: "1px solid var(--gray-6)",
          }}
        >
          <Text
            as="p"
            m="0"
            mb="3"
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--gray-12)",
            }}
          >
            Muted Rules
          </Text>
          <Box
            asChild
            m="0"
            style={{
              listStyleType: "none",
              paddingInlineStart: 0,
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
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
        </Box>
      )}
      <Box
        asChild
        m="0"
        style={{
          listStyleType: "none",
          paddingInlineStart: 0,
        }}
      >
        <ol>
          {lintResult.map((message) => (
            <li
              key={`${message.ruleId}-${message.page}-${message.loc.start.line}-${message.loc.start.column}`}
            >
              <LintMessageItem message={message} muteRule={muteRule} />
            </li>
          ))}
        </ol>
      </Box>
    </Box>
  )
}

export default LintResultViewer
