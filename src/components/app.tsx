import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { type FC, type ReactElement, Suspense } from "react"
import {
  fileState,
  fileTextContentsState,
  filteredLintResultState,
  visibilityFilterState,
} from "../states"
import { Block, LayoutContainer, LayoutItem } from "./layout"
import LintResultViewer from "./lintresultviewer"
import PDFTextViewer from "./pdftextviewer"

interface AppLayoutProps {
  header: ReactElement
  main: ReactElement
}

const AppLayout: FC<AppLayoutProps> = ({ header, main }) => (
  <LayoutContainer
    style={{
      gridTemplateAreas: `
        "header"
        "main"
      `,
      gridTemplateRows: "3rem 1fr",
    }}
  >
    <LayoutItem area="header">{header}</LayoutItem>
    <LayoutItem area="main">{main}</LayoutItem>
  </LayoutContainer>
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
}) => <LayoutContainer>{fileInput}</LayoutContainer>

interface AfterFileUploadMainLayoutProps {
  pdfTextViewer: ReactElement
  lintResultViewer: ReactElement
}

const AfterFileUploadMainLayout: FC<AfterFileUploadMainLayoutProps> = ({
  pdfTextViewer,
  lintResultViewer,
}) => (
  <LayoutContainer
    style={{
      gridTemplateAreas: `"pdf lint"`,
      gridTemplateColumns: "1fr 1fr",
    }}
  >
    <LayoutItem area="pdf" scrollable>
      {pdfTextViewer}
    </LayoutItem>
    <LayoutItem area="lint" scrollable>
      {lintResultViewer}
    </LayoutItem>
  </LayoutContainer>
)

const TitleLine = () => (
  <div style={{ display: "inline-flex", alignItems: "end" }}>
    <h1 style={{ margin: 0, fontSize: "1.25rem" }}>PDF Linter</h1>
    <p
      style={{
        marginTop: 0,
        marginLeft: "0.5em",
        marginBottom: 0,
        verticalAlign: "bottom",
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
  <LayoutContainer
    style={{
      gridTemplateAreas: '"titleline"',
      gridTemplateColumns: "1fr",
      alignContent: "center",
    }}
  >
    <LayoutItem area="titleline">{titleline}</LayoutItem>
  </LayoutContainer>
)

const Header = () => (
  <Block as="header">
    <HeaderLayout titleline={<TitleLine />} />
  </Block>
)

const FilterFormLogicContainer: FC = () => {
  const setFile = useSetAtom(fileState)
  return (
    <div style={{ placeSelf: "center" }}>
      <input
        type="file"
        accept="application/pdf"
        aria-label="PDFファイルを選択"
        onChange={(event) => {
          if (event.target.files === null) {
            return
          }
          const file = event.target.files[0]
          setFile(file)
        }}
      />
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
