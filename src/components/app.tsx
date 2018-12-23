import React, { ChangeEvent, Component, Fragment } from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import styled from "styled-components"
import getPDFDoc, { forEachPage, lintPage } from "../pdf"
import PDFViewer from "./pdfviewer"
import { PDFPageProxy } from "pdfjs-dist"
import LintResultViewer from "./lintresultviewer"
import { onFileInput, onLintFinished } from "../actions"
import { State } from "../reducers"

interface MyAppProp {
  state: State
  dispatch: Dispatch
}

class App extends Component<MyAppProp> {
  constructor(props: MyAppProp) {
    super(props)
    this.onFileInput = this.onFileInput.bind(this)
  }
  async onFileInput(event: ChangeEvent<HTMLInputElement>) {
    const dispatch = this.props.dispatch
    const file = event.target.files[0]
    dispatch(onFileInput({ file: file }))
    const pdfDoc = await getPDFDoc(file)
    const pages = await Promise.all(forEachPage(pdfDoc) as Iterable<
      PromiseLike<PDFPageProxy>
    >)
    const lintResults = await Promise.all(pages.map(page => lintPage(page)))
    dispatch(onLintFinished({ lintResults: lintResults }))
  }
  render() {
    const file = this.props.state.file
    const lintResults = this.props.state.lintResults
    return (
      <Fragment>
        <input
          type="file"
          accept="application/pdf"
          onChange={this.onFileInput}
        />
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
