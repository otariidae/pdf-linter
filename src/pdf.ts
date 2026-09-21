import {
  GlobalWorkerOptions,
  getDocument,
  type PDFDocumentProxy,
  type PDFPageProxy,
} from "pdfjs-dist"
import PdfjsWorker from "pdfjs-dist/build/pdf.worker?worker"
import type { TextItem } from "pdfjs-dist/types/src/display/api"
import { agentLog } from "./debug-log"
import { TextlintWorkerWrapper } from "./textlint-worker-wrapper"
import type { LintResult } from "./type"

GlobalWorkerOptions.workerPort = new PdfjsWorker()
const textlint = new TextlintWorkerWrapper(new Worker("./textlint-worker.js"))

export async function lintPDFTexts(texts: string[]): Promise<LintResult> {
  // #region agent log
  agentLog("B", "pdf.ts:lintPDFTexts:entry", "lintPDFTexts called", {
    pageCount: texts.length,
    textLengths: texts.map((t) => t.length),
    textPreviews: texts.map((t) => t.slice(0, 120)),
  })
  // #endregion
  try {
    const responses = await Promise.all(texts.map((text) => textlint.lint(text)))
    const lintResult = responses
      .map((response) => response.result.messages)
      .flatMap((messages, index) =>
        messages.map((message) => ({
          ...message,
          page: index + 1,
        })),
      )
    // #region agent log
    agentLog("D", "pdf.ts:lintPDFTexts:exit", "lintPDFTexts result", {
      messageCount: lintResult.length,
      ruleIds: lintResult.map((m) => m.ruleId),
      messages: lintResult.map((m) => ({
        ruleId: m.ruleId,
        severity: m.severity,
        message: m.message.slice(0, 80),
      })),
    })
    // #endregion
    return lintResult
  } catch (error) {
    // #region agent log
    agentLog("B", "pdf.ts:lintPDFTexts:error", "lintPDFTexts failed", {
      error: String(error),
    })
    // #endregion
    throw error
  }
}

export async function extractTextFromPDFFile(file: File): Promise<string[]> {
  // #region agent log
  agentLog(
    "A",
    "pdf.ts:extractTextFromPDFFile:entry",
    "extractTextFromPDFFile called",
    {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    },
  )
  // #endregion
  try {
    const doc = await getPDFDoc(file)
    const pages = await Promise.all(forEachPage(doc))
    const textList = await Promise.all(
      pages.map((page) => extractTextFromPage(page)),
    )
    // #region agent log
    agentLog(
      "A",
      "pdf.ts:extractTextFromPDFFile:exit",
      "PDF text extracted",
      {
        pageCount: textList.length,
        texts: textList,
        hasDoubleNegative: textList.some((t) => t.includes("なくもない")),
        hasKangxi: textList.some((t) => t.includes("⾰")),
        hasHype: textList.some((t) => t.includes("魔法のように")),
      },
    )
    // #endregion
    return textList
  } catch (error) {
    // #region agent log
    agentLog(
      "A",
      "pdf.ts:extractTextFromPDFFile:error",
      "PDF extraction failed",
      {
        error: String(error),
      },
    )
    // #endregion
    throw error
  }
}

async function extractTextFromPage(pdfPage: PDFPageProxy): Promise<string> {
  let text = ""
  for await (const line of extractLinesFromPage(pdfPage)) {
    text += `${line}\n`
  }
  return text.replace(/\0/g, "")
}

async function* extractLinesFromPage(pdfPage: PDFPageProxy) {
  const textContent = await pdfPage.getTextContent()
  const texts = textContent.items.filter(
    (item): item is TextItem => "str" in item,
  )
  let line = ""
  for (const text of texts) {
    line += text.str
    if (text.hasEOL) {
      yield line
      line = ""
    }
  }
  // yield any remaining lines after loop
  if (line.length > 0) {
    yield line
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
  pdfDocument: PDFDocumentProxy,
): Iterable<PromiseLike<PDFPageProxy>> {
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = pdfDocument.getPage(i)
    yield page
  }
}
