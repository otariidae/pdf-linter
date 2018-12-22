import React, { Component, Fragment, Suspense } from "react"
import { render } from "react-dom"
import { createStore } from "redux"
import { Provider, connect } from "react-redux"
import PDFViewer from "./pdfviewer.js"

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

const mapStateToProps = state => ({ state })
const MyAppConnected = connect(mapStateToProps)(MyApp)

render(
  <Provider store={store}>
    <MyAppConnected />
  </Provider>,
  document.getElementById("app")
)
