import { FilePlusIcon } from "@radix-ui/react-icons"
import { Box, Flex, Grid, Heading, Text } from "@radix-ui/themes"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { type FC, type ReactElement, Suspense } from "react"
import {
  fileState,
  fileTextContentsState,
  filteredLintResultState,
  visibilityFilterState,
} from "../states"
import LintResultViewer from "./lintresultviewer"
import PDFTextViewer from "./pdftextviewer"

interface AppLayoutProps {
  header: ReactElement
  main: ReactElement
}

const AppLayout: FC<AppLayoutProps> = ({ header, main }) => (
  <Grid
    width="100%"
    height="100%"
    areas={`
      "header"
      "main"
    `}
    rows="3rem 1fr"
  >
    <Box gridArea="header">{header}</Box>
    <Box gridArea="main" overflow="hidden">
      {main}
    </Box>
  </Grid>
)

const MainLogicContainer: FC = () => {
  const file = useAtomValue(fileState)
  if (file === null) {
    return (
      <BeforeFileUploadMainLayout fileInput={<FilterFormLogicContainer />} />
    )
  }
  return (
    <AfterFileUploadMainLayout
      pdfTextViewer={
        <Suspense fallback={<p>loading</p>}>
          <PDFTextViewerLogicContainer />
        </Suspense>
      }
      lintResultViewer={
        <Suspense fallback={<p>loading</p>}>
          <LintResultViewerLogicContainer />
        </Suspense>
      }
    />
  )
}

interface BeforeFileUploadMainLayoutProps {
  fileInput: ReactElement
}

const BeforeFileUploadMainLayout: FC<BeforeFileUploadMainLayoutProps> = ({
  fileInput,
}) => (
  <Grid width="100%" height="100%">
    {fileInput}
  </Grid>
)

interface AfterFileUploadMainLayoutProps {
  pdfTextViewer: ReactElement
  lintResultViewer: ReactElement
}

const AfterFileUploadMainLayout: FC<AfterFileUploadMainLayoutProps> = ({
  pdfTextViewer,
  lintResultViewer,
}) => (
  <Grid
    width="100%"
    height="100%"
    p="6"
    areas={`"pdf lint"`}
    columns="1fr 1fr"
    gap="6"
  >
    <Box gridArea="pdf" overflow="auto">
      {pdfTextViewer}
    </Box>
    <Box gridArea="lint" overflow="auto">
      {lintResultViewer}
    </Box>
  </Grid>
)

const TitleLine = () => (
  <Flex
    align="center"
    gap="4"
    style={{
      animation: "slideDown 0.6s ease-out",
    }}
  >
    <Heading
      as="h1"
      size="7"
      weight="bold"
      style={{
        letterSpacing: "-0.02em",
      }}
    >
      PDF Linter
    </Heading>
    <Box
      style={{
        width: "2px",
        height: "1.5rem",
        background: "var(--accent-9)",
        transform: "rotate(15deg)",
      }}
    />
    <Text
      as="p"
      size="3"
      weight="light"
      style={{
        color: "var(--gray-11)",
        letterSpacing: "0.01em",
      }}
    >
      Find problems with text in your PDF file
    </Text>
  </Flex>
)

interface HeaderLayoutProps {
  titleline: ReactElement
}
const HeaderLayout: FC<HeaderLayoutProps> = ({ titleline }) => (
  <Grid
    width="100%"
    height="100%"
    px="8"
    areas={`"titleline"`}
    columns="1fr"
    align="center"
  >
    <Box gridArea="titleline">{titleline}</Box>
  </Grid>
)

const Header = () => (
  <Flex
    asChild
    width="100%"
    height="100%"
    style={{
      background: "var(--color-panel)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid var(--gray-6)",
      boxShadow: "var(--shadow-1)",
    }}
  >
    <header>
      <HeaderLayout titleline={<TitleLine />} />
    </header>
  </Flex>
)

const FilterFormLogicContainer: FC = () => {
  const setFile = useSetAtom(fileState)
  return (
    <Box
      width="100%"
      maxWidth="600px"
      p="8"
      style={{
        placeSelf: "center",
        animation: "scaleIn 0.5s ease-out",
      }}
    >
      <Flex
        asChild
        direction="column"
        align="center"
        justify="center"
        gap="6"
        p="8"
        style={{
          background: "var(--color-panel)",
          border: "2px dashed var(--accent-8)",
          borderRadius: "var(--radius-4)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "var(--shadow-3)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--accent-9)"
          e.currentTarget.style.transform = "scale(1.02)"
          e.currentTarget.style.boxShadow = "var(--shadow-5)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--accent-8)"
          e.currentTarget.style.transform = "scale(1)"
          e.currentTarget.style.boxShadow = "var(--shadow-3)"
        }}
      >
        <label>
          <Flex
            width="80px"
            height="80px"
            align="center"
            justify="center"
            style={{
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--accent-9) 0%, var(--orange-9) 100%)",
              boxShadow: "var(--shadow-4)",
            }}
          >
            <FilePlusIcon
              width="40"
              height="40"
              color="white"
              aria-label="PDFファイルを追加"
            />
          </Flex>
          <Box>
            <Text as="p" size="6" mb="2" align="center">
              PDFファイルを選択
            </Text>
            <Text as="p" size="3" color="gray">
              クリックしてファイルを選択
            </Text>
          </Box>
          <input
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={(event) => {
              if (event.target.files === null) {
                return
              }
              const file = event.target.files[0]
              setFile(file)
            }}
          />
        </label>
      </Flex>
    </Box>
  )
}

const PDFTextViewerLogicContainer = () => {
  const pdfText = useAtomValue(fileTextContentsState)
  if (pdfText === null) {
    return null
  }
  return <PDFTextViewer pageTexts={pdfText} />
}

const LintResultViewerLogicContainer = () => {
  const lintResult = useAtomValue(filteredLintResultState)
  const [visibilityFilter, setVisibilityFilter] = useAtom(visibilityFilterState)

  function muteRule(ruleId: string) {
    const newVisibilityFilter = new Set(visibilityFilter)
    newVisibilityFilter.add(ruleId)
    setVisibilityFilter(newVisibilityFilter)
  }

  function unmuteRule(ruleId: string) {
    const newVisibilityFilter = new Set(visibilityFilter)
    newVisibilityFilter.delete(ruleId)
    setVisibilityFilter(newVisibilityFilter)
  }

  return (
    <LintResultViewer
      lintResult={lintResult}
      mutedRuleIds={visibilityFilter}
      muteRule={muteRule}
      unmuteRule={unmuteRule}
    />
  )
}

const App = () => (
  <AppLayout header={<Header />} main={<MainLogicContainer />} />
)

export default App
