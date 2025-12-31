import { Box, Heading, Text } from "@radix-ui/themes"
import { type FC, Fragment } from "react"
import "./pdftextviewer.css"

interface PDFTextViewerProps {
  pageTexts: string[]
}

const PDFTextViewer: FC<PDFTextViewerProps> = ({ pageTexts }) => (
  <Box
    style={{
      whiteSpace: "pre-wrap",
      fontSize: "0.875rem",
      padding: "1.5rem",
    }}
  >
    <Box
      style={{
        marginBottom: "1.5rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid var(--gray-6)",
      }}
    >
      <Heading
        as="h3"
        style={{
          margin: 0,
          fontSize: "1.25rem",
          fontFamily: "var(--font-display)",
          color: "var(--gray-12)",
          fontWeight: 700,
        }}
      >
        PDF Text
      </Heading>
      <Text
        as="p"
        style={{
          margin: "0.25rem 0 0 0",
          fontSize: "0.875rem",
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
          style={{
            margin: "1.5rem 0 0.75rem 0",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--gray-12)",
            fontFamily: "var(--font-body)",
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
