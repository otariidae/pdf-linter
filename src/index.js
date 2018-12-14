import React, { Component, Fragment } from "react"
import { render } from "react-dom"
import { createStore } from "redux"
import { Provider, connect } from "react-redux"
import getPDFDoc, { forEachPage } from "./pdf.js"

const initialState = {
  file: null
}

const actionTypes = {
  ON_FILE_INPUT: "ON_FILE_INPUT"
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ON_FILE_INPUT:
      return Object.assign({}, state, {
        file: action.payload.file
      })
    default:
      return state
  }
}

const store = createStore(reducer)

class MyApp extends Component {
  render() {
    const file = this.props.state.file
    const dispatch = this.props.dispatch

    return (
      <Fragment>
        <input
          type="file"
          accept="application/pdf"
          onChange={event =>
            dispatch({
              type: actionTypes.ON_FILE_INPUT,
              payload: {
                file: event.target.files[0]
              }
            })
          }
        />
        {file !== null && (
          <PDFViewer style={{ "max-width": "256px" }} file={file} />
        )}
      </Fragment>
    )
  }
}

class PDFViewer extends Component {
  constructor(...props) {
    super(...props)
    this.state = {
      pages: null
    }
  }
  componentWillMount() {
    getPDFDoc(this.props.file)
      .then(doc => {
        const promises = forEachPage(doc)
        return Promise.all(promises)
      })
      .then(pages => {
        this.setState({
          pages: pages
        })
      })
  }
  render() {
    if (!this.state.pages) {
      return <p>LOADING</p>
    }
    const pages = Array.from(this.state.pages)
    return (
      <div style={{ maxWidth: "256px" }}>
        {pages.map((page, i) => (
          <PDFPage key={i} page={page} />
        ))}
      </div>
    )
  }
}

class PDFPage extends Component {
  constructor(...props) {
    super(...props)
    this.canvas = React.createRef()
  }
  componentDidMount() {
    const page = this.props.page
    const viewport = page.getViewport(1.0)
    const canvas = this.canvas.current
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext("2d")
    const renderTask = page.render({
      canvasContext: ctx,
      viewport: viewport
    })
  }
  render() {
    return <canvas style={{ maxWidth: "100%" }} ref={this.canvas} />
  }
}

const mapStateToProps = state => ({ state })
const MyAppConnected = connect(mapStateToProps)(MyApp)

render(
  <Provider store={store}>
    <MyAppConnected />
  </Provider>,
  document.getElementById("app")
)
