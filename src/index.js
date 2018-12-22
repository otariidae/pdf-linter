import React, { Component, Fragment, Suspense } from "react"
import { render } from "react-dom"
import { createStore } from "redux"
import { Provider, connect } from "react-redux"
import getPDFDoc, { forEachPage, lintPage } from "./pdf.js"
import PDFViewer from "./pdfviewer.js"

const initialState = {
  file: null,
  lintResults: []
}

const actionTypes = {
  ON_FILE_INPUT: "ON_FILE_INPUT",
  ON_LINT_FINISHED: "ON_LINT_FINISHED"
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ON_FILE_INPUT:
      return Object.assign({}, state, {
        file: action.payload.file
      })
    case actionTypes.ON_LINT_FINISHED:
      return Object.assign({}, state, {
        lintResults: action.payload.lintResults
      })
    default:
      return state
  }
}

const store = createStore(reducer)

class MyApp extends Component {
  constructor(...props) {
    super(...props)
    this.onFileInput = this.onFileInput.bind(this)
  }
  async onFileInput() {
    const dispatch = this.props.dispatch
    const file = event.target.files[0]
    dispatch({
      type: actionTypes.ON_FILE_INPUT,
      payload: {
        file
      }
    })
    const pdfDoc = await getPDFDoc(file)
    const pages = await Promise.all(Array.from(forEachPage(pdfDoc)))
    const lintResults = await Promise.all(pages.map(page => lintPage(page)))
    dispatch({
      type: actionTypes.ON_LINT_FINISHED,
      payload: {
        lintResults
      }
    })
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
        {file !== null && (
          <PDFViewer style={{ "max-width": "256px" }} file={file} />
        )}
        <LintResultViewer lintResults={lintResults} />
      </Fragment>
    )
  }
}

const LintResultViewer = ({ lintResults }) =>
  lintResults.map((result, i) => (
    <ul key={i}>
      {result.map((item, i) => (
        <li key={i}>
          行: {item.line} 列: {item.column}: {item.message}
        </li>
      ))}
    </ul>
  ))

const mapStateToProps = state => ({ state })
const MyAppConnected = connect(mapStateToProps)(MyApp)

render(
  <Provider store={store}>
    <MyAppConnected />
  </Provider>,
  document.getElementById("app")
)
