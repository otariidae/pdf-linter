import { promises as fs } from "fs"
import pdfjs, { PDFDocumentProxy, PDFPageProxy, PDFPromise } from "pdfjs-dist"
const { CMapCompressionType } = require("pdfjs-dist/lib/shared/util")
import { LintResult } from "./type"

class NodeCMapReaderFactory {
  baseUrl: string | null
  isCompressed: boolean
  constructor({
    baseUrl = null,
    isCompressed = false
  }: {
    baseUrl?: string
    isCompressed?: boolean
  }) {
    this.baseUrl = baseUrl
    this.isCompressed = isCompressed
  }
  async fetch({ name }: { name?: string }) {
    if (!name) {
      throw new Error("CMap name must be specified.")
    }
    const url = this.baseUrl + name + (this.isCompressed ? ".bcmap" : "")
    let data
    try {
      data = await fs.readFile(url)
    } catch (e) {
      throw new Error(
        `Unable to load ${this.isCompressed ? "binary " : ""} CMap at: ${url}`
      )
    }
    return {
      cMapData: new Uint8Array(data),
      compressionType: this.isCompressed
        ? CMapCompressionType.BINARY
        : CMapCompressionType.NONE
    }
  }
}

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
  const uint8arr = new Uint8Array(arrayBuf)
  return uint8arr
}

function* forEachTwo<T>(iterable: Iterable<T>): Iterable<[T, T]> {
  let pre = iterable[Symbol.iterator]().next().value
  for (const cur of iterable) {
    yield [pre, cur]
    pre = cur
  }
}

export async function getTextFromPage(pdfPage: PDFPageProxy): Promise<string> {
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

export async function lintPDFFile(file: File): Promise<LintResult> {
  const formData = new FormData()
  formData.append("file", file)
  const response = await fetch("/lint", {
    method: "POST",
    body: formData
  })
  const lintResult = await response.json()
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

export async function getPDFDocNodeJS(file: Buffer): Promise<PDFDocumentProxy> {
  const uint8 = new Uint8Array(file)
  const pdfDocument = await (((pdfjs as any).getDocument({
    data: uint8,
    CMapReaderFactory: NodeCMapReaderFactory,
    cMapUrl: "./dist/cmaps/",
    cMapPacked: true
  }) as any) as PDFDocumentLoadingTask).promise
  return pdfDocument
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
