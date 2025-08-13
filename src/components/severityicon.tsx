import type { TextlintRuleSeverityLevel } from "@textlint/kernel"

export function SeverityIcon({
  severity,
}: {
  severity: TextlintRuleSeverityLevel
}) {
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
