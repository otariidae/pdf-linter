import React, { Fragment, FunctionComponent } from "react";
import { connect } from "react-redux"
import styled from "styled-components"
import PDFViewer from "./pdfviewer"
import LintResultViewer from "./lintresultviewer"
import Form from "./form"
import { State } from "../type"

type AppProp = {
  file: State["file"]
}

const App: FunctionComponent<AppProp> = ({ file }) => {
  return (
    <Fragment>
      <Form />
      <PaneContainer>
        <PDFViewerWrapper>
          {file === null ? undefined : <PDFViewer file={file} />}
        </PDFViewerWrapper>
        <LintResultWrapper>
          <LintResultViewer />
        </LintResultWrapper>
      </PaneContainer>
    </Fragment>
  )
}

const PaneContainer = styled.div`
  display: flex;
`

const PDFViewerWrapper = styled.div`
  flex-basis: 50%;
`
const LintResultWrapper = styled.div`
  flex-basis: 50%;
`

const mapStateToProps = (state: State) => ({ file: state.file })
export default connect(mapStateToProps)(App)
