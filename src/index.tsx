import React, {
  ChangeEvent,
  Component,
  Fragment,
  memo,
  FunctionComponent
} from "react"
import { render } from "react-dom"
import { Action, Dispatch, createStore } from "redux"
import { Provider, connect } from "react-redux"
import styled from "styled-components"
import getPDFDoc, { forEachPage, lintPage } from "./pdf"
import PDFViewer from "./pdfviewer"
import actionCreatorFactory, { isType } from "typescript-fsa"
import { TextlintMessage } from "@textlint/kernel"
import { PDFPageProxy, PDFPromise } from "pdfjs-dist"

type PageLintResult = TextlintMessage[]
type LintResult = PageLintResult[]
const actionCreator = actionCreatorFactory()
const onFileInput = actionCreator<{ file: File }>("ON_FILE_INPUT")
const onLintFinished = actionCreator<{ lintResults: LintResult }>(
  "ON_LINT_FINISHED"
)

interface State {
  file: File | null
  lintResults: LintResult
}
const initialState: State = {
  file: null,
  lintResults: []
}

function reducer(state: State = initialState, action: Action): State {
  if (isType(action, onFileInput)) {
    return Object.assign({}, state, {
      file: action.payload.file
    })
  }
  if (isType(action, onLintFinished)) {
    return Object.assign({}, state, {
      lintResults: action.payload.lintResults
    })
  }
  return state
}

const store = createStore(reducer)

interface MyAppProp {
  state: State
  dispatch: Dispatch
}

class MyApp extends Component<MyAppProp> {
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
            {file === null ? <div /> : <PDFViewer file={file} />}
          </PDFViewerWrapper>
          <LintResultWrapper>
            <LintResultViewer lintResults={lintResults} />
          </LintResultWrapper>
        </PaneContainer>
      </Fragment>
    )
  }
}

interface LintResultViewerProp {
  lintResults: LintResult
}

const LintResultViewer: FunctionComponent<LintResultViewerProp> = ({
  lintResults
}) => (
  <Fragment>
    {lintResults.map((result, i) => (
      <Fragment key={i}>
        <p>ページ {i + 1}</p>
        <ul>
          {result.map((item, i) => (
            <li key={i}>
              行: {item.line} 列: {item.column}: {item.message}
            </li>
          ))}
        </ul>
      </Fragment>
    ))}
  </Fragment>
)

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
const mapDispatchToProps = (dispatch: Dispatch) => ({
  fileInput(file: File) {
    dispatch(onFileInput({ file: file }))
  },
  lintFinished(lintResults: LintResult) {
    dispatch(onLintFinished({ lintResults: lintResults }))
  }
})
const MyAppConnected = connect(mapStateToProps)(MyApp)

render(
  <Provider store={store}>
    <MyAppConnected />
  </Provider>,
  document.getElementById("app")
)
