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
  switch (severity) {
    case 0:
      return <InfoCircledIcon style={{ color: "royalblue" }} />
    case 1:
      return <ExclamationTriangleIcon style={{ color: "orange" }} />
    case 2:
      return <CrossCircledIcon style={{ color: "red" }} />
  }
}
