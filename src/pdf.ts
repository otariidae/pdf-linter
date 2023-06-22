import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
  type PDFPageProxy,
} from "pdfjs-dist"
import PdfjsWorker from "pdfjs-dist/build/pdf.worker?worker"
import { type LintResult } from "./type"
import { TextlintWorkerWrapper } from "./textlint-worker-wrapper"
import { type TextItem } from "pdfjs-dist/types/src/display/api"

GlobalWorkerOptions.workerPort = new PdfjsWorker()
const textlint = new TextlintWorkerWrapper(new Worker("./textlint-worker.js"))

export async function lintPDFTexts(texts: string[]): Promise<LintResult> {
  const responses = await Promise.all(texts.map((text) => textlint.lint(text)))
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

async function extractTextFromPage(pdfPage: PDFPageProxy): Promise<string> {
  let text = ""
  for await (const line of extractLinesFromPage(pdfPage)) {
    text += line + "\n"
  }
  return text.replace(/\0/g, "")
}

async function* extractLinesFromPage(pdfPage: PDFPageProxy) {
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

async function getPDFDoc(file: File): Promise<PDFDocumentProxy> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfDocument = await getDocument({
    data: arrayBuffer,
    cMapUrl: "./cmaps/",
    cMapPacked: true,
  }).promise
  return pdfDocument
}

function* forEachPage(
  pdfDocument: PDFDocumentProxy
): Iterable<PromiseLike<PDFPageProxy>> {
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = pdfDocument.getPage(i)
    yield page
  }
}
