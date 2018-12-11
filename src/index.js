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

async function lintPage(pdfPage) {
  console.log(await pdfPage.getTextContent())
  // Display page on the existing canvas with 100% scale.
  const texts = (await pdfPage.getTextContent()).items
  console.log(await pdfPage.getTextContent())
  let text = ""
  if (texts.length !== 0) {
    text += texts[0].str
  }
  for (let i = 0; i < texts.length - 1; i++) {
    const pre = texts[i]
    const cur = texts[i + 1]
    if (pre.transform[5] === cur.transform[5]) {
      text += cur.str
      continue
    }
    text += "\n" + cur.str
  }
  console.log(text)
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

btn.addEventListener("change", async e => {
  const file = e.target.files[0]
  const fileTypedArr = await file2uint8(file)
  const loadingTask = pdfjs.getDocument({
    data: fileTypedArr,
    cMapUrl: "./cmaps/",
    cMapPacked: true
  })
  const pdfDocument = await loadingTask.promise
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i)
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
