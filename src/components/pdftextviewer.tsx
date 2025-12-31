import { Box, Heading, Text } from "@radix-ui/themes"
import { type FC, Fragment } from "react"
import "./pdftextviewer.css"

interface PDFTextViewerProps {
  pageTexts: string[]
}

const PDFTextViewer: FC<PDFTextViewerProps> = ({ pageTexts }) => (
  <Box
    p="6"
    style={{
      whiteSpace: "pre-wrap",
    }}
  >
    <Box
      mb="6"
      pb="4"
      style={{
        borderBottom: "1px solid var(--gray-6)",
      }}
    >
      <Heading
        as="h3"
        size="5"
        weight="bold"
        m="0"
        style={{
          color: "var(--gray-12)",
        }}
      >
        PDF Text
      </Heading>
      <Text
        as="p"
        size="2"
        mt="1"
        m="0"
        style={{
          color: "var(--gray-11)",
        }}
      >
        {pageTexts.length} {pageTexts.length === 1 ? "page" : "pages"}
      </Text>
    </Box>
    {pageTexts.map((text, i) => (
      <Fragment key={`page-${i + 1}`}>
        <Text
          as="p"
          size="2"
          weight="medium"
          mt="6"
          mb="3"
          style={{
            color: "var(--gray-12)",
          }}
        >
          Page {i + 1} of {pageTexts.length}
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
