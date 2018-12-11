const pdfjs = require("pdfjs-dist")
pdfjs.GlobalWorkerOptions.workerSrc = "./worker.js"

const btn = document.getElementById("file-btn")

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

async function lintPage(pdfPage) {
  const text = await getTextFromPage(pdfPage)
  const result = await fetch("/lint", {
    method: "POST",
    body: text
  })
  const res = await result.json()
  for (const r of res) {
    for (const message of r.messages) {
      console.log(`
      行: ${message.line} 列: ${message.column}: ${message.message}
      `)
    }
  }
}

async function* forEachPage(pdfDocument) {
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i)
    yield page
  }
}

btn.addEventListener("change", async e => {
  const file = e.target.files[0]
  const fileTypedArr = await file2uint8(file)
  const pdfDocument = await pdfjs.getDocument({
    data: fileTypedArr,
    cMapUrl: "./cmaps/",
    cMapPacked: true
  }).promise
  for await (const page of forEachPage(pdfDocument)) {
    lintPage(page)
    const viewport = page.getViewport(1.0)
    const canvas = document.createElement("canvas")
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext("2d")
    const renderTask = page.render({
      canvasContext: ctx,
      viewport: viewport
    })
    document.body.appendChild(canvas)
  }
  console.log(await pdfDocument.getMetadata())
})
