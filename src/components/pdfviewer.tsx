import { VFC } from "react"
import { css } from "emotion"

type PDFViewerProp = {
  file: File
}

const className = css`
  width: 100%;
  height: 100%;
`

const PDFViewer: VFC<PDFViewerProp> = ({ file }) => {
  const url = URL.createObjectURL(file)
  return <embed src={url} className={className} />
}

export default PDFViewer
