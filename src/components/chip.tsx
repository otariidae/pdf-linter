import { Cross2Icon } from "@radix-ui/react-icons"
import { Button, Code, Flex } from "@radix-ui/themes"
import type { FC } from "react"

interface ChipProps {
  body: string
  closeButtonTitle: string
  onCloseClick: () => void
}

export const Chip: FC<ChipProps> = ({
  body,
  closeButtonTitle,
  onCloseClick,
}) => (
  <Flex
    display="inline-flex"
    align="center"
    gap="1"
    px="3"
    py="1"
    style={{
      border: "1px solid var(--gray-7)",
      borderRadius: "var(--radius-5)",
      background: "var(--color-panel)",
      transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "var(--accent-8)"
      e.currentTarget.style.background = "var(--accent-a2)"
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "var(--gray-7)"
      e.currentTarget.style.background = "var(--color-panel)"
    }}
  >
    <Code
      size="1"
      weight="medium"
      style={{
        color: "var(--gray-12)",
        background: "transparent",
      }}
    >
      {body}
    </Code>
    <Button
      variant="ghost"
      size="1"
      title={closeButtonTitle}
      onClick={onCloseClick}
      style={{
        padding: 0,
        cursor: "pointer",
        minWidth: "auto",
        height: "auto",
        color: "var(--gray-10)",
        transition: "color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--accent-11)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--gray-10)"
      }}
    >
      <Cross2Icon />
    </Button>
  </Flex>
)
