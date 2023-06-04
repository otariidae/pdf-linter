import { Suspense, type VFC } from "react"
import { css } from "emotion"
import PDFTextViewer from "./pdftextviewer"
import LintResultViewer from "./lintresultviewer"
import Form from "./form"

const App: VFC = () => (
  <div className={appStyle}>
    <header className={headerStyle}>
      <h1 className={headingStyle}>PDF Linter</h1>
    </header>
    <div className={formStyle}>
      <Form />
    </div>
    <div className={pdfStyle}>
      <Suspense fallback={<p>loading</p>}>
        <PDFTextViewer />
      </Suspense>
    </div>
    <div className={lintStyle}>
      <Suspense fallback={<p>loading</p>}>
        <LintResultViewer />
      </Suspense>
    </div>
  </div>
)

const appStyle = css`
  height: 100vh;
  display: grid;
  grid-template-rows: 3rem 1fr;
  grid-template-columns: 300px 1fr 1fr;
  grid-template-areas:
    "header header header"
    "form pdf lint";
`

const formStyle = css`
  grid-area: form;
  overflow: auto;
`

const headerStyle = css`
  grid-area: header;
`

const headingStyle = css`
  margin: 0;
  font-size: 1.3rem;
  line-height: 3rem;
`

const pdfStyle = css`
  grid-area: pdf;
  overflow: auto;
`
const lintStyle = css`
  grid-area: lint;
  overflow: auto;
`

export default App
