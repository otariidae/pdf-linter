import React, { Component, PureComponent } from "react"
import styled from "styled-components"
import getPDFDoc, { forEachPage } from "./pdf.js"

export default class PDFViewer extends Component {
  constructor(...props) {
    super(...props)
    this.state = {
      pages: null
    }
  }
  render() {
    if (!this.state.pages) {
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
      return <p>LOADING</p>
    }
    const pages = this.state.pages
    return (
      <PDFPageList>
        {pages.map((page, i) => (
          <li key={i}>
            <PDFPage page={page} />
          </li>
        ))}
      </PDFPageList>
    )
  }
}

class PDFPage extends PureComponent {
  constructor(...props) {
    super(...props)
    this.renderPDF = this.renderPDF.bind(this)
  }
  renderPDF(canvas) {
    const page = this.props.page
    const viewport = page.getViewport(1.0)
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext("2d")
    page.render({
      canvasContext: ctx,
      viewport: viewport
    })
  }
  render() {
    return <canvas style={{ maxWidth: "100%" }} ref={this.renderPDF} />
  }
}

const PDFPageList = styled.ul`
  list-style-type: none;
  padding-left: 0;
`
