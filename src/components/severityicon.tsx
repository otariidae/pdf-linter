import {
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons"
import type { TextlintRuleSeverityLevel } from "@textlint/kernel"

export function SeverityIcon({
  severity,
}: {
  severity: TextlintRuleSeverityLevel
}) {
  const iconStyle = {
    width: "1.25rem",
    height: "1.25rem",
  }

  switch (severity) {
    case 0:
      return (
        <InfoCircledIcon style={{ ...iconStyle, color: "var(--blue-9)" }} />
      )
    case 1:
      return (
        <ExclamationTriangleIcon
          style={{ ...iconStyle, color: "var(--orange-9)" }}
        />
      )
    case 2:
      return (
        <CrossCircledIcon style={{ ...iconStyle, color: "var(--red-9)" }} />
      )
  }
}
