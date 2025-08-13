import { css } from "@emotion/css"
import type { FC } from "react"

const chipStyle = css`
  display: inline-grid;
  align-items: center;
  grid-template-columns: 1fr 1.5rem;
  grid-template-areas: "content icon";
  padding: 0.2rem 0.2rem 0.2rem 0.75rem;
  border: 1px solid black;
  border-radius: 2rem;
  margin-inline-end: 0.5rem;
`

const chipContentStyle = css`
  grid-area: content;
  vertical-align: middle;
  font-size: 0.75rem;
`

const closeButtonStyle = css`
    grid-area: icon;
    padding: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;
`

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
  <span className={chipStyle}>
    <span className={chipContentStyle}>{body}</span>
    <button
      type="button"
      title={closeButtonTitle}
      className={`material-symbols-outlined ${closeButtonStyle}`}
      onClick={onCloseClick}
    >
      close
    </button>
  </span>
)
