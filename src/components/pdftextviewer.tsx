import { Box, Text } from "@radix-ui/themes"
import { type FC, Fragment } from "react"
import "./pdftextviewer.css"

interface PDFTextViewerProps {
  pageTexts: string[]
}

const PDFTextViewer: FC<PDFTextViewerProps> = ({ pageTexts }) => (
  <Box
    style={{
      whiteSpace: "pre-wrap",
      fontSize: "0.8rem",
    }}
  >
    {pageTexts.map((text, i) => (
      <Fragment key={i}>
        <Text as="p">
          page {i + 1} of {pageTexts.length}:
        </Text>
        <LineNumberedTextViewer pageNumber={i + 1} text={text} />
      </Fragment>
    ))}
  </Box>
)

interface LineNumberedTextViewerProps {
  pageNumber: number
  text: string
}
const LineNumberedTextViewer: FC<LineNumberedTextViewerProps> = ({
  pageNumber,
  text,
}) => {
  const lines = text.split("\n")
  return (
    <ol className="line-numbered-text-viewer">
      {lines.map((line, i) => {
        const id = `p${pageNumber}-l${i + 1}`
        return (
          <li key={id} id={id}>
            {line}
          </li>
        )
      })}
    </ol>
  )
}

export default PDFTextViewer
