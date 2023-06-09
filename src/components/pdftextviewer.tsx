import { Fragment, type VFC } from "react"
import { css } from "@emotion/css"

interface PDFTextViewerProps {
  pageTexts: string[]
}
const PDFTextViewer: VFC<PDFTextViewerProps> = ({ pageTexts }) => (
  <div
    className={css`
      white-space: pre-wrap;
      font-size: 0.8rem;
    `}
  >
    {pageTexts.map((text, i) => (
      <Fragment key={i}>
        <p>
          page {i + 1} of {pageTexts.length}:
        </p>
        <LineNumberedTextViewer pageNumber={i + 1} text={text} />
      </Fragment>
    ))}
  </div>
)

const textViewerClassName = css`
  @counter-style dotless-item {
    system: numeric;
    symbols: "0" "1" "2" "3" "4" "5" "6" "7" "8" "9";
    suffix: "";
  }

  list-style-type: dotless-item;
  list-style-position: outside;
  padding-inline-start: 3ex;

  li {
    padding-left: 0.5em;

    &:target {
      background-color: moccasin;
    }
    &::marker {
      font-family: monospace;
      color: rgba(0, 0, 0, 0.5);
    }
  }
`

interface LineNumberedTextViewerProps {
  pageNumber: number
  text: string
}
const LineNumberedTextViewer: VFC<LineNumberedTextViewerProps> = ({
  pageNumber,
  text,
}) => {
  const lines = text.split("\n")
  return (
    <ol className={textViewerClassName}>
      {lines.map((line, i) => {
        return (
          <li key={i} id={`p${pageNumber}-l${i + 1}`}>
            {line}
          </li>
        )
      })}
    </ol>
  )
}

export default PDFTextViewer
