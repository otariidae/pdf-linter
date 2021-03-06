import React, { FunctionComponent, StrictMode, Suspense } from "react"
import { useRecoilValue } from "recoil"
import { css } from "emotion"
import PDFViewer from "./pdfviewer"
import LintResultViewer from "./lintresultviewer"
import Form from "./form"
import { fileState } from "../states"

const App: FunctionComponent<{}> = () => {
  const file = useRecoilValue(fileState)
  return (
    <StrictMode>
      <div className={appStyle}>
        <header className={headerStyle}>
          <h1 className={headingStyle}>PDF Linter</h1>
        </header>
        <div className={formStyle}>
          <Form />
        </div>
        {file === null ? undefined : (
          <div className={pdfStyle}>
            <PDFViewer file={file} />
          </div>
        )}
        <div className={lintStyle}>
          <Suspense fallback={<p>loading</p>}>
            <LintResultViewer />
          </Suspense>
        </div>
      </div>
    </StrictMode>
  )
}

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
`
const lintStyle = css`
  grid-area: lint;
  overflow: auto;
`

export default App
