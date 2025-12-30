import { Cross2Icon } from "@radix-ui/react-icons"
import { Button, Flex, Text } from "@radix-ui/themes"
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
      border: "1px solid var(--gray-8)",
      borderRadius: "2rem",
      marginInlineEnd: "0.5rem",
    }}
  >
    <Text size="1">{body}</Text>
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
      }}
    >
      <Cross2Icon />
    </Button>
  </Flex>
)
