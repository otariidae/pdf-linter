import { FilePlusIcon } from "@radix-ui/react-icons"
import { Box } from "@radix-ui/themes"
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
  <Box
    style={{
      width: "100%",
      height: "100%",
      display: "grid",
      gridTemplateAreas: `
        "header"
        "main"
      `,
      gridTemplateRows: "3rem 1fr",
    }}
  >
    <Box style={{ gridArea: "header" }}>{header}</Box>
    <Box style={{ gridArea: "main", overflow: "hidden" }}>{main}</Box>
  </Box>
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
  <Box
    style={{
      width: "100%",
      height: "100%",
      display: "grid",
    }}
  >
    {fileInput}
  </Box>
)

interface AfterFileUploadMainLayoutProps {
  pdfTextViewer: ReactElement
  lintResultViewer: ReactElement
}

const AfterFileUploadMainLayout: FC<AfterFileUploadMainLayoutProps> = ({
  pdfTextViewer,
  lintResultViewer,
}) => (
  <Box
    style={{
      width: "100%",
      height: "100%",
      display: "grid",
      gridTemplateAreas: `"pdf lint"`,
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5rem",
      padding: "1.5rem",
    }}
  >
    <Box
      style={{
        gridArea: "pdf",
        overflow: "auto",
        background: "var(--color-panel)",
        borderRadius: "var(--radius-3)",
        border: "1px solid var(--gray-6)",
        boxShadow: "var(--shadow-3)",
        animation: "slideUp 0.6s ease-out",
      }}
    >
      {pdfTextViewer}
    </Box>
    <Box
      style={{
        gridArea: "lint",
        overflow: "auto",
        background: "var(--color-panel)",
        borderRadius: "var(--radius-3)",
        border: "1px solid var(--gray-6)",
        boxShadow: "var(--shadow-3)",
        animation: "slideUp 0.6s ease-out 0.1s",
        animationFillMode: "backwards",
      }}
    >
      {lintResultViewer}
    </Box>
  </Box>
)

const TitleLine = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      animation: "slideDown 0.6s ease-out",
    }}
  >
    <h1
      style={{
        margin: 0,
        fontSize: "1.75rem",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        color: "var(--gray-12)",
        letterSpacing: "-0.02em",
      }}
    >
      PDF Linter
    </h1>
    <div
      style={{
        width: "2px",
        height: "1.5rem",
        background: "var(--accent-9)",
        transform: "rotate(15deg)",
      }}
    />
    <p
      style={{
        margin: 0,
        fontSize: "0.95rem",
        color: "var(--gray-11)",
        fontWeight: 300,
        letterSpacing: "0.01em",
      }}
    >
      Find problems with text in your PDF file
    </p>
  </div>
)

interface HeaderLayoutProps {
  titleline: ReactElement
}
const HeaderLayout: FC<HeaderLayoutProps> = ({ titleline }) => (
  <Box
    style={{
      width: "100%",
      height: "100%",
      display: "grid",
      gridTemplateAreas: '"titleline"',
      gridTemplateColumns: "1fr",
      alignContent: "center",
      padding: "0 2rem",
    }}
  >
    <Box style={{ gridArea: "titleline" }}>{titleline}</Box>
  </Box>
)

const Header = () => (
  <Box
    asChild
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      background: "var(--color-panel)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid var(--gray-6)",
      boxShadow: "var(--shadow-1)",
    }}
  >
    <header>
      <HeaderLayout titleline={<TitleLine />} />
    </header>
  </Box>
)

const FilterFormLogicContainer: FC = () => {
  const setFile = useSetAtom(fileState)
  return (
    <div
      style={{
        placeSelf: "center",
        width: "100%",
        maxWidth: "600px",
        padding: "2rem",
        animation: "scaleIn 0.5s ease-out",
      }}
    >
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "4rem 2rem",
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
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, var(--accent-9) 0%, var(--orange-9) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-4)",
          }}
        >
          <FilePlusIcon
            width="40"
            height="40"
            style={{ color: "white" }}
            aria-label="PDFファイルを追加"
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "1.5rem",
              fontFamily: "var(--font-display)",
              color: "var(--gray-12)",
            }}
          >
            PDFファイルを選択
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "var(--gray-11)",
            }}
          >
            クリックしてファイルを選択
          </p>
        </div>
        <input
          type="file"
          accept="application/pdf"
          aria-label="PDFファイルを選択"
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
    </div>
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
