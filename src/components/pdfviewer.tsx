import React from "react"
import { css } from "emotion"

type PDFViewerProp = {
  file: File
}

const className = css`
  width: 100%;
  height: 100%;
`

export default ({ file }: PDFViewerProp) => {
  const url = URL.createObjectURL(file)
  return <embed src={url} className={className} />
}
