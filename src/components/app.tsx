import type { TextlintRuleSeverityLevel } from "@textlint/kernel"
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
import LintStats from "./lintstats"
import PDFTextViewer from "./pdftextviewer"

interface AppLayoutProps {
  header: ReactElement
  form: ReactElement
  pdfTextViewer: ReactElement
  lintResultViewer: ReactElement
  lintStats: ReactElement
}

const AppLayout: FC<AppLayoutProps> = ({
  header,
  form,
  pdfTextViewer,
  lintResultViewer,
  lintStats,
}) => (
  <LayoutContainer
    style={{
      gridTemplateAreas: `
        "header header header"
        "form form form"
        "pdf lint stats"`,
      gridTemplateColumns: "2fr 2fr 1fr",
      gridTemplateRows: "3rem 2rem 1fr",
    }}
  >
    <LayoutItem area="header">{header}</LayoutItem>
    <LayoutItem area="form">{form}</LayoutItem>
    <LayoutItem area="pdf" scrollable>
      {pdfTextViewer}
    </LayoutItem>
    <LayoutItem area="lint" scrollable>
      {lintResultViewer}
    </LayoutItem>
    <LayoutItem area="stats" scrollable>
      {lintStats}
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
    <div>
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

const LintStatsLogicContainer = () => {
  const lintResult = useAtomValue(filteredLintResultState)
  const stats: Record<TextlintRuleSeverityLevel, number> = {
    0: 0,
    1: 0,
    2: 0,
  }
  for (const message of lintResult) {
    stats[message.severity]++
  }
  return <LintStats lintStats={stats} />
}

const App = () => (
  <AppLayout
    header={<Header />}
    form={
      <Suspense fallback={<p>loading</p>}>
        <FilterFormLogicContainer />
      </Suspense>
    }
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
    lintStats={
      <Suspense fallback={<p>loading</p>}>
        <LintStatsLogicContainer />
      </Suspense>
    }
  />
)

export default App
