import { Fragment, type VFC } from "react"
import { css } from "emotion"
import { useRecoilValue } from "recoil"
import { fileTextContentsState } from "../states"

const className = css`
  white-space: pre-wrap;
  font-size: 0.8rem;
`

const PDFTextViewer: VFC = () => {
  const fileTextContents = useRecoilValue(fileTextContentsState)
  return (
    <div className={className}>
      {fileTextContents?.map((text, i) => (
        <Fragment key={i}>
          <p>
            page {i + 1} of {fileTextContents.length}:
          </p>
          <TextViewer pageNumber={i + 1} text={text} />
        </Fragment>
      ))}
    </div>
  )
}

const textViewerClassName = css`
  @counter-style dotless-item {
    system: numeric;
    symbols: "0" "1" "2" "3" "4" "5" "6" "7" "8" "9";
    suffix: "";
  }

  list-style: dotless-item;

  li {
    margin-left: 0.5em;

    &:target {
      background-color: moccasin;
    }
  }
`

interface TextViewerProps {
  pageNumber: number
  text: string
}
const TextViewer: VFC<TextViewerProps> = ({ pageNumber, text }) => {
  const lines = text.split("\n")
  return (
    <ol className={textViewerClassName}>
      {lines.map((line, index) => {
        return (
          <li key={index} id={`p${pageNumber}-l${index + 1}`}>
            {line}
          </li>
        )
      })}
    </ol>
  )
}

export default PDFTextViewer
