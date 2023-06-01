import * as pdfjs from "pdfjs-dist"
import { type LintResult } from "./type"
import { createTextlint } from "./textlint-worker-init"
import { type TextItem } from "pdfjs-dist/types/src/display/api"

export async function lintPDFFile(file: File): Promise<LintResult> {
  const textPerPage = await getTextListFromPDFFile(file)
  const textlint = await createTextlint()
  const responses = await Promise.all(
    textPerPage.map((text) => textlint.lintText(text))
  )
  textlint.exit()
  const lintResult = responses
    .map((response) => response.result.messages)
    .map((messages, index) =>
      messages.map((message) => ({
        ...message,
        page: index + 1,
      }))
    )
    .flat()
  return lintResult
}

async function getTextListFromPDFFile(file: File): Promise<string[]> {
  const doc = await getPDFDoc(file)
  const pages = await Promise.all(forEachPage(doc))
  const textList = await Promise.all(pages.map((page) => getTextFromPage(page)))
  console.log(textList)
  return textList
}

async function getPDFDoc(file: File): Promise<pdfjs.PDFDocumentProxy> {
  const uint8 = await file2uint8(file)
  const pdfDocument = await pdfjs.getDocument({
    data: uint8,
    cMapUrl: "./cmaps/",
    cMapPacked: true,
  }).promise
  return pdfDocument
}

function* forEachPage(
  pdfDocument: pdfjs.PDFDocumentProxy
): Iterable<PromiseLike<pdfjs.PDFPageProxy>> {
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = pdfDocument.getPage(i) as PromiseLike<pdfjs.PDFPageProxy>
    yield page
  }
}

async function getTextFromPage(pdfPage: pdfjs.PDFPageProxy): Promise<string> {
  const textContent = await pdfPage.getTextContent()
  const texts = textContent.items.filter(
    (item): item is TextItem => "str" in item
  )
  let text = ""
  if (texts.length !== 0) {
    text += texts[0].str
  }
  for (const [pre, cur] of slidingWindows2(texts)) {
    if (pre.transform[5] === cur.transform[5]) {
      text += cur.str
      continue
    }
    text += "\n" + cur.str
  }
  return text.replace(/\0/g, "")
}

/**
 * inspired by Deno collections slidingWindows
 * https://deno.land/std@0.107.0/collections/mod.ts?s=slidingWindows
 */
function* slidingWindows2<T>(array: readonly T[]): Iterable<[T, T]> {
  for (let i = 0; i < array.length - 1; i++) {
    yield [array[i], array[i + 1]]
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
