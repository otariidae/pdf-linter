import React, { useState, createRef, useEffect } from "react"
import styled from "styled-components"
import getPDFDoc, { forEachPage } from "../pdf"
import { PDFPageProxy } from "pdfjs-dist"

type PDFViewerProp = {
  file: File
}

const PDFViewer = (props: PDFViewerProp) => {
  const [pages, setPages] = useState<PDFPageProxy[] | null>(null)
  if (!pages) {
    getPDFDoc(props.file)
      .then(doc => {
        const promises = forEachPage(doc) as Iterable<
          PromiseLike<PDFPageProxy>
        >
        return Promise.all(promises)
      })
      .then(pages => {
        setPages(pages)
      })
    return <p>LOADING</p>
  }
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

export default PDFViewer

type PDFPageProp = {
  page: PDFPageProxy
}

export const PDFPage = (props: PDFPageProp) => {
  const ref = createRef<HTMLCanvasElement>()
  useEffect(() => {
    const canvas = ref.current
    if (canvas === null) {
      return
    }
    const page = props.page
    const viewport = page.getViewport(1.0)
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext("2d")
    page.render({
      canvasContext: ctx,
      viewport: viewport
    })
  }, [ref.current])
  return <canvas style={{ maxWidth: "100%" }} ref={ref} />
}

const PDFPageList = styled.ul`
  list-style-type: none;
  padding-left: 0;
`
