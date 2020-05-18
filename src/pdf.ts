import pdfjs, { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist"
import { LintResult } from "./type"

export async function lintPDFFile(file: File): Promise<LintResult> {
  const textList = await getTextListFromPDFFile(file)
  const response = await fetch("/.netlify/functions/lint", {
    method: "POST",
    body: JSON.stringify(textList),
  })
  const lintResult = await response.json()
  return lintResult
}

async function getTextListFromPDFFile(file: File): Promise<string[]> {
  const doc = await getPDFDoc(file)
  const pages = await Promise.all(forEachPage(doc))
  const textList = await Promise.all(pages.map((page) => getTextFromPage(page)))
  return textList
}

async function getPDFDoc(file: File): Promise<PDFDocumentProxy> {
  const uint8 = await file2uint8(file)
  const pdfDocument = await pdfjs.getDocument({
    data: uint8,
    cMapUrl: "./cmaps/",
    cMapPacked: true,
  }).promise
  return pdfDocument
}

function* forEachPage(
  pdfDocument: PDFDocumentProxy
): Iterable<PromiseLike<PDFPageProxy>> {
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = pdfDocument.getPage(i) as PromiseLike<PDFPageProxy>
    yield page
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
  return text.replace(/\0/g, "")
}

function* forEachTwo<T>(iterable: Iterable<T>): Iterable<[T, T]> {
  let pre = iterable[Symbol.iterator]().next().value
  for (const cur of iterable) {
    yield [pre, cur]
    pre = cur
  }
}

async function file2uint8(file: File): Promise<Uint8Array> {
  const arrayBuf = await readAsArrayBuffer(file)
  const uint8arr = new Uint8Array(arrayBuf)
  return uint8arr
}

function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener("load", () => resolve(reader.result as ArrayBuffer))
    reader.addEventListener("error", () => reject(reader.error))
    reader.readAsArrayBuffer(file)
  })
}
