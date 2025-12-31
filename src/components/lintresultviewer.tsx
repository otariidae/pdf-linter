import {
  Box,
  Button,
  Code,
  Flex,
  Grid,
  Heading,
  Link,
  Text,
} from "@radix-ui/themes"
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
        size="2"
        m="0"
        mb="2"
        style={{
          color: "var(--gray-12)",
        }}
      >
        {message.message}
      </Text>
      <Flex gap="2" align="center" mt="2" wrap="wrap">
        <Code
          asChild
          size="1"
          weight="medium"
          style={{
            color: "var(--accent-11)",
            textDecoration: "none",
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
          <Link href={`#p${message.page}-l${message.loc.start.line}`}>
            {formatMessageLocation(message)}
          </Link>
        </Code>
        <Code
          size="1"
          style={{
            color: "var(--gray-10)",
            background: "transparent",
          }}
        >
          {message.ruleId}
        </Code>
        <Button
          variant="ghost"
          size="1"
          title={`mute ${message.ruleId} rule`}
          onClick={() => muteRule(message.ruleId)}
          style={{
            cursor: "pointer",
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
          size="5"
          weight="bold"
          m="0"
          style={{
            color: "var(--gray-12)",
          }}
        >
          Lint Results
        </Heading>
        <Flex
          asChild
          mt="2"
          mb="0"
          pl="0"
          gap="3"
          style={{
            listStyle: "none",
          }}
        >
          <ul>
            {Object.entries(stats).map(([severity, count]) => (
              <Box asChild key={severity}>
                <li>
                  <Text
                    size="2"
                    weight="medium"
                    style={{
                      padding: "0.375rem 0.75rem",
                      background:
                        severity === "2"
                          ? "var(--red-a3)"
                          : severity === "1"
                            ? "var(--orange-a3)"
                            : "var(--blue-a3)",
                      borderRadius: "var(--radius-2)",
                      display: "inline-block",
                    }}
                  >
                    {formatSevertyCount(
                      severity as unknown as TextlintRuleSeverityLevel,
                      count,
                    )}
                  </Text>
                </li>
              </Box>
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
            size="2"
            weight="medium"
            m="0"
            mb="3"
            style={{
              color: "var(--gray-12)",
            }}
          >
            Muted Rules
          </Text>
          <Flex
            asChild
            m="0"
            pl="0"
            gap="2"
            wrap="wrap"
            style={{
              listStyleType: "none",
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
          </Flex>
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
