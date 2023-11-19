import type {
  TextlintMessage,
  TextlintRuleSeverityLevel,
} from "@textlint/kernel"
import { type ChangeEvent, type ReactElement, Suspense, type VFC } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import {
  fileState,
  fileTextContentsState,
  filteredLintResultState,
  lintResultState,
  soloFilterState,
  visibilityFilterState,
} from "../states"
import type { LintResult } from "../type"
import FilterForm from "./form"
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

const AppLayout: VFC<AppLayoutProps> = ({
  header,
  form,
  pdfTextViewer,
  lintResultViewer,
  lintStats,
}) => (
  <LayoutContainer
    style={{
      gridTemplateAreas: `
        "header header header header"
        "form pdf lint stats"`,
      gridTemplateColumns: "2fr 4fr 3fr 1fr",
      gridTemplateRows: "3rem 1fr",
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
const HeaderLayout: VFC<HeaderLayoutProps> = ({ titleline }) => (
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

function removeDuplicateArray<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

const getTextlintRuleId = (lintResults: LintResult) =>
  removeDuplicateArray(
    lintResults.map((message: TextlintMessage) => message.ruleId),
  )

function toggleSet<T>(set: Set<T>, item: T) {
  if (set.has(item)) {
    set.delete(item)
  } else {
    set.add(item)
  }
  return set
}

const FilterFormLogicContainer: VFC = () => {
  const setFile = useSetRecoilState(fileState)
  const lintResult = useRecoilValue(lintResultState)
  const ruleIds = getTextlintRuleId(lintResult)
  const [visibilityFilter, setVisibilityFilter] = useRecoilState(
    visibilityFilterState,
  )
  const [soloFilter, setSoloFilter] = useRecoilState(soloFilterState)
  const toggleVisibilityFilter = (ruleId: string) => {
    const newVisibilityFilter = new Set(visibilityFilter)
    toggleSet(newVisibilityFilter, ruleId)
    setVisibilityFilter(newVisibilityFilter)
  }
  const toggleSoloFilter = (ruleId: string) => {
    const newSoloFilter = new Set(soloFilter)
    toggleSet(newSoloFilter, ruleId)
    setSoloFilter(newSoloFilter)
  }
  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        aria-label="PDFファイルを選択"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          if (event.target.files === null) {
            return
          }
          const file = event.target.files[0]
          setFile(file)
        }}
      />
      <Suspense fallback={<p>loading</p>}>
        <FilterForm
          ruleIds={ruleIds}
          muteIds={visibilityFilter}
          soloIds={soloFilter}
          toggleMute={toggleVisibilityFilter}
          toggleSolo={toggleSoloFilter}
        />
      </Suspense>
    </div>
  )
}

const PDFTextViewerLogicContainer = () => {
  const pdfText = useRecoilValue(fileTextContentsState)
  if (pdfText === null) {
    return null
  }
  return <PDFTextViewer pageTexts={pdfText} />
}

const LintResultViewerLogicContainer = () => {
  const lintResult = useRecoilValue(filteredLintResultState)
  return <LintResultViewer lintResult={lintResult} />
}

const LintStatsLogicContainer = () => {
  const lintResult = useRecoilValue(filteredLintResultState)
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
