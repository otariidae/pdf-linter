import { promises as fs } from "fs"
import pdfjs, { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist"
const { CMapCompressionType } = require("pdfjs-dist/lib/shared/util")
import { LintResult } from "./type"

class NodeCMapReaderFactory {
  baseUrl: string | null
  isCompressed: boolean
  constructor({
    baseUrl = null,
    isCompressed = false,
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
        : CMapCompressionType.NONE,
    }
  }
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
  return text.replace(/\0/g, "")
}

export async function lintPDFFile(file: File): Promise<LintResult> {
  const base64file = await readFileAsDataURLAsync(file)
  const response = await fetch("/.netlify/functions/lint", {
    method: "POST",
    body: base64file,
  })
  const lintResult = await response.json()
  return lintResult
}

export function* forEachPage(
  pdfDocument: PDFDocumentProxy
): Iterable<PromiseLike<PDFPageProxy>> {
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = pdfDocument.getPage(i) as PromiseLike<PDFPageProxy>
    yield page
  }
}

export async function getPDFDocNodeJS(file: Buffer): Promise<PDFDocumentProxy> {
  const uint8 = new Uint8Array(file)
  const pdfDocument = await pdfjs.getDocument({
    data: uint8,
    CMapReaderFactory: NodeCMapReaderFactory,
    cMapUrl: "./dist/cmaps/",
    cMapPacked: true,
  }).promise
  return pdfDocument
}

const readFileAsDataURLAsync = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.addEventListener("load", () => {
      resolve(fileReader.result as string)
    })
    fileReader.addEventListener("error", () => {
      reject(fileReader.error)
    })
    fileReader.readAsDataURL(file)
  })
