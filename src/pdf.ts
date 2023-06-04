import * as pdfjs from "pdfjs-dist"
import { type LintResult } from "./type"
import { createTextlint } from "./textlint-worker-init"
import { type TextItem } from "pdfjs-dist/types/src/display/api"

export async function lintPDFTexts(texts: string[]): Promise<LintResult> {
  const textlint = await createTextlint()
  const responses = []
  for (const text of texts) {
    // lintText seems to have to be called serially to avoid race condition
    const response = await textlint.lintText(text)
    responses.push(response)
  }
  textlint.exit()
  const lintResult = responses
    .map((response) => response.result.messages)
    .flatMap((messages, index) =>
      messages.map((message) => ({
        ...message,
        page: index + 1,
      }))
    )
  return lintResult
}

export async function extractTextFromPDFFile(file: File): Promise<string[]> {
  const doc = await getPDFDoc(file)
  const pages = await Promise.all(forEachPage(doc))
  const textList = await Promise.all(
    pages.map((page) => extractTextFromPage(page))
  )
  return textList
}

async function extractTextFromPage(
  pdfPage: pdfjs.PDFPageProxy
): Promise<string> {
  let text = ""
  for await (const line of extractLinesFromPage(pdfPage)) {
    text += line + "\n"
  }
  return text.replace(/\0/g, "")
}

async function* extractLinesFromPage(pdfPage: pdfjs.PDFPageProxy) {
  const textContent = await pdfPage.getTextContent()
  const texts = textContent.items.filter(
    (item): item is TextItem => "str" in item
  )
  let line = ""
  for (const text of texts) {
    line += text.str
    if (text.hasEOL) {
      yield line
      line = ""
    }
  }
}

async function getPDFDoc(file: File): Promise<pdfjs.PDFDocumentProxy> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfDocument = await pdfjs.getDocument({
    data: arrayBuffer,
    cMapUrl: "./cmaps/",
    cMapPacked: true,
  }).promise
  return pdfDocument
}

function* forEachPage(
  pdfDocument: pdfjs.PDFDocumentProxy
): Iterable<PromiseLike<pdfjs.PDFPageProxy>> {
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = pdfDocument.getPage(i)
    yield page
  }
}
