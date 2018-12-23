import pdfjs, {
  PDFDocumentProxy,
  PDFPageProxy,
  PDFJSStatic,
  PDFPromise
} from "pdfjs-dist"
import { TextlintMessage } from "@textlint/kernel"
// const pdfjs: PDFJSStatic = require("pdfjs-dist")

function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener("load", () => resolve(reader.result as ArrayBuffer))
    reader.addEventListener("error", () => reject(reader.error))
    reader.readAsArrayBuffer(file)
  })
}

async function file2uint8(file: File): Promise<Uint8Array> {
  const arrayBuf = await readAsArrayBuffer(file)
  console.log(arrayBuf)
  const uint8arr = new Uint8Array(arrayBuf)
  return uint8arr
}

function* forEachTwo<T>(iterable: Iterable<T>): Iterable<Array<T>> {
  let pre = iterable[Symbol.iterator]().next().value
  for (const cur of iterable) {
    yield [pre, cur]
    pre = cur
  }
}

async function getTextFromPage(pdfPage: PDFPageProxy): Promise<string> {
  const texts = (await pdfPage.getTextContent()).items
  let text = ""
  if (texts.length !== 0) {
    text += texts[0].str
  }
  for (const [pre, cur] of forEachTwo(texts)) {
    if (pre.transform[5] === cur.transform[5]) {
      text += cur.str
      continue
    }
    text += "\n" + cur.str
  }
  return text
}

export async function lintPage(
  pdfPage: PDFPageProxy
): Promise<TextlintMessage[]> {
  const text = await getTextFromPage(pdfPage)
  const result = await fetch("/lint", {
    method: "POST",
    body: text
  })
  const res = await result.json()
  const lintResult = []
  for (const r of res) {
    for (const message of r.messages) {
      console.log(`
      行: ${message.line} 列: ${message.column}: ${message.message}
      `)
      lintResult.push(message)
    }
  }
  return lintResult
}

export function* forEachPage(
  pdfDocument: PDFDocumentProxy
): Iterable<PDFPromise<PDFPageProxy>> {
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = pdfDocument.getPage(i)
    yield page
  }
}

interface PDFDocumentLoadingTask {
  promise: PDFPromise<PDFDocumentProxy>
}

export default async function getPDFDoc(file: File): Promise<PDFDocumentProxy> {
  const fileTypedArr = await file2uint8(file)
  const pdfDocument = await (((pdfjs as any).getDocument({
    data: fileTypedArr,
    cMapUrl: "./cmaps/",
    cMapPacked: true
  }) as any) as PDFDocumentLoadingTask).promise
  return pdfDocument
}
