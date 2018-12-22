import pdfjs from "pdfjs-dist"
pdfjs.GlobalWorkerOptions.workerSrc = "./worker.js"

function readAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener("load", () => resolve(reader.result))
    reader.addEventListener("error", () => reject(reader.error))
    reader.readAsArrayBuffer(file)
  })
}

async function file2uint8(file) {
  const arrayBuf = await readAsArrayBuffer(file)
  console.log(arrayBuf)
  const uint8arr = new Uint8Array(arrayBuf)
  return uint8arr
}

function* forEachTwo(iterable) {
  let pre = iterable[Symbol.iterator]().next().value
  for (const cur of iterable) {
    yield [pre, cur]
    pre = cur
  }
}

async function getTextFromPage(pdfPage) {
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

export async function lintPage(pdfPage) {
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

export function* forEachPage(pdfDocument) {
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = pdfDocument.getPage(i)
    yield page
  }
}

export default async function getPDFDoc(file) {
  const fileTypedArr = await file2uint8(file)
  const pdfDocument = await pdfjs.getDocument({
    data: fileTypedArr,
    cMapUrl: "./cmaps/",
    cMapPacked: true
  }).promise
  return pdfDocument
}
