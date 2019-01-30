import React, { Component, Fragment } from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import styled from "styled-components"
import PDFViewer from "./pdfviewer"
import LintResultViewer from "./lintresultviewer"
import Form from "./form"
import { State } from "../type"

type AppProp = {
  state: State
  dispatch: Dispatch
}

class App extends Component<AppProp> {
  render() {
    const file = this.props.state.file
    const lintResults = this.props.state.lintResults
    return (
      <Fragment>
        <Form />
        <PaneContainer>
          <PDFViewerWrapper>
            {file === null ? <Fragment /> : <PDFViewer file={file} />}
          </PDFViewerWrapper>
          <LintResultWrapper>
            <LintResultViewer lintResults={lintResults} />
          </LintResultWrapper>
        </PaneContainer>
      </Fragment>
    )
  }
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

const mapStateToProps = (state: State) => ({ state })
export default connect(mapStateToProps)(App)
