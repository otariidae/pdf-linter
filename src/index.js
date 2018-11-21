const pdfjs = require("pdfjs-dist")

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

btn.addEventListener("change", async e => {
  const file = e.target.files[0]
  const fileTypedArr = await file2uint8(file)
  const loadingTask = pdfjs.getDocument(fileTypedArr)
  const pdfDocument = await loadingTask.promise
  console.log(await pdfDocument.getMetadata())
  // Request a first page
  const pdfPage = await pdfDocument.getPage(1)
  console.log(await pdfPage.getTextContent())
  // Display page on the existing canvas with 100% scale.
  const viewport = pdfPage.getViewport(1.0)
  const canvas = document.getElementsByTagName("canvas")[0]
  canvas.width = viewport.width
  canvas.height = viewport.height
  const ctx = canvas.getContext("2d")
  const renderTask = pdfPage.render({
    canvasContext: ctx,
    viewport: viewport
  })
  const texts = (await pdfPage.getTextContent()).items
  console.log(pdfPage.getTextContent())
  let text = ""
  if (texts.length !== 0) {
    text += texts[0].str
  }
  for (let i= 0; i < texts.length - 1; i++) {
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
  console.log(await result.json())
})
