'use strict'

const MARGIN = 6
const LINE_STYLES = {
    solid: [],
    dashed: [3, 3],
}
const MULTIPLIER = {
    start: 0,
    center: .5,
    end: 1
}
const SELECTED_RECT_DIFF = 1
const SELECTED_LINE_COLOR = '#ed593e'
let gRotateCenter = { x: 0, y: 0 }

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth > 400 ? 400 : elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetWidth > 400 ? 400 : elContainer.offsetWidth
    drawMeme()
}

function drawMeme(meme = getMeme()) {
    const img = new Image()
    img.src = meme.url
    img.onload = () => {
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
        drawImg(img)
        drawLines()
        markSelectedElement(meme.selectedLineIdx)
    }
}

function drawImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function markSelectedElement(idx) {
    if (idx !== -1) {
        const line = getMeme().lines[idx]
        drawRect(line)
    }
}

function drawLines() {
    const meme = getMeme()
    meme.lines.forEach((line, idx) => {
        if (!line.canvasHeight || !line.canvasWidth) {
            setTextProp('canvasHeight', gElCanvas.height, idx)
            setTextProp('canvasWidth', gElCanvas.width, idx)
        } else translateTextDims(gElCanvas.width, gElCanvas.height, idx)
        setTextStyle(line)
        if (!line.x || !line.y) setLineDefaultPos(idx, meme.lines, gElCanvas.height)
        drawText(line)
    })
}

function drawText({ txt, x, y }) {
    gCtx.fillText(txt, x, y)
    gCtx.strokeText(txt, x, y)
}

function setTextStyle(line) {
    if (!line) return
    setDrawStyle(line.stokreSize, line.strokeColor, 'solid', line.color, line.size, line.font)
}

function setDrawStyle(width = 1, stroke = 'black', strokeLineStyle = 'solid', color = 'black', size = '20', font = 'Impcat') {
    gCtx.lineWidth = width
    gCtx.strokeStyle = stroke
    gCtx.setLineDash(LINE_STYLES[strokeLineStyle])
    gCtx.fillStyle = color
    gCtx.font = `${size}px ${font}`
}

function drawRect(line) {
    if (!line) return
    const height = line.size
    gCtx.beginPath()
    setDrawStyle(3, SELECTED_LINE_COLOR, 'dashed')
    gCtx.rect(line.x - 4, line.y - height + 2, line.width + 8, height + 4)
    gCtx.stroke()
}

function drawCircle({ x, y }, radius) {
    gCtx.beginPath()
    gCtx.arc(x, y, radius, 0, 2 * Math.PI)
    gCtx.stroke()
    gCtx.fill()
}

function setLineDefaultPos(idx, lines, canvasHeight) {
    const linesCount = lines.length
    const x = getXByAlignment(lines[idx], idx)
    if (linesCount === 1) return { x, y: (canvasHeight - lines[0].size) / 2 }
    const potentialHeight = canvasHeight - lines[0].size - 2 * MARGIN
    const y = potentialHeight * idx / (linesCount - 1) + lines[0].size + MARGIN
    setLinePos({ y }, idx)
    return { x, y }
}

function getXByAlignment(line, idx) {
    if (!line || line.align === 'none') return line.x
    const width = line.width || setTextProp('width', getLineWidth(line), idx)
    const x = Math.abs((gElCanvas.width - width) * MULTIPLIER[line.align] - MARGIN)
    setLinePos({ x }, idx)
    return x
}

function isTooBig(line) {
    if (!line) return
    const width = line.width || getLineWidth(line)
    return (width > gElCanvas.width - 2 * MARGIN || line.size > gElCanvas.height - 2 * MARGIN)
}

function isOnTheEdge(line, diff, idx) {
    if (!line) return
    const { x, y } = line
    let size = line.size
    const width = line.width || setTextProp('width', getLineWidth(line))
    if (!diff || idx === undefined) return (x + width > gElCanvas.width + MARGIN || y - size < MARGIN)
    return (x + diff.x <= MARGIN && diff.x < 0 || y + diff.y - line.size <= MARGIN && diff.y < 0 ||
        x + diff.x + width >= gElCanvas.width - MARGIN && diff.x > 0 || y + diff.y >= gElCanvas.height - MARGIN && diff.y > 0)
}

function fixPos(line) {
    if (!line) return
    const width = line.width || setTextProp('width', getLineWidth(line))
    let x = line.x
    let y = line.y
    if (width + x > gElCanvas.width - MARGIN) x--
    if (y - line.size < MARGIN) y++
    setLinePos({ x, y })
}
