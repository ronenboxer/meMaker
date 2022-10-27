'use strict'

const MARGIN = 3
const MULTIPLIER = {
    start: 0,
    center: .5,
    end: 1
}
let gRotateCenter = { x: 0, y: 0 }

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetWidth
}

function setTextStyle(line) {
    setDrawStyle(line.stokreSize, line.strokeColor, 'solid', line.color, line.size, line.font, line.angle)
}

function setDrawStyle(width = 1, stroke = 'black', strokeLineStyle = 'solid', color = 'black', size = '20', font = 'Impcat', angle = 0) {
    gCtx.lineWidth = width
    gCtx.strokeStyle = stroke
    gCtx.setLineDash(LINE_STYLES[strokeLineStyle])
    gCtx.fillStyle = color
    gCtx.font = `${size}px ${font}`
}

function getXByAlignment(align, idx) {
    const line = getMeme().lines[idx]
    if (align === 'none') return line.x
    const width = getElemetWidth(line)
    const x = Math.abs((gElCanvas.width - width) * MULTIPLIER[align] - MARGIN)
    setTextProp('x', x, idx)
    return x
}

function drawMeme(meme = getMeme()) {
    const img = new Image()
    img.src = meme.url
    img.onload = () => {
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
        drawImg(img)
        drawLines()
        if (meme.selectedLineIdx !== -1) {
            const line = meme.lines[meme.selectedLineIdx]
            const { x, y } = line
            const width = getElemetWidth(line)
            drawRect(line, width, line.size, 1)
        }
    }
}

function drawImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function drawLines() {
    const meme = getMeme()
    meme.lines.forEach((line, idx) => {
        const { txt, font, size, align, color, angle } = line
        setTextStyle(line)
        if (line.x && line.y) return drawText({ txt, font, size, x: getXByAlignment(align, idx), y: line.y, color, angle })
        const { x, y } = setLineCoords(idx, meme.lines, gElCanvas.width, gElCanvas.height, align)
        gCtx.rotate(line.angle)
        drawText({ txt, font, size, x, y, color, angle })
        gCtx.setTransform(1, 0, 0, 1, 0, 0);
    })
}

function drawText({ txt, x, y, angle }) {
    gCtx.translate(gRotateCenter.x, gRotateCenter.y)
    gCtx.rotate(-angle)
    gCtx.translate(-gRotateCenter.x, -gRotateCenter.y)
    gCtx.fillText(txt, x, y)
    gCtx.strokeText(txt, x, y)
    gCtx.rotate(angle)
}

function drawRect(line, width, height, diff = 0) {
    const { a, b, c, d } = getRectPositions({ x: line.x, y: line.y }, line.angle, width, height)
    setDrawStyle(1, 'blue')
    gCtx.beginPath()
    gCtx.moveTo(a.x - diff, a.y + diff * .2 * height)
    gCtx.lineTo(b.x - diff, b.y - diff)
    gCtx.lineTo(c.x + diff, c.y - diff)
    gCtx.lineTo(d.x + diff, d.y + diff * .2 * height)
    gCtx.closePath()
    gCtx.stroke()
    const x = (a.x + d.x) / 2
    const y = (a.y + d.y) / 2 + .2 * diff * height
    // gRotateCenter = { x, y }
    // const bottomCenter = getElementsCenter({ x: a.x - diff, y: a.y + diff * .2 * height }, { x: d.x + diff, y: d.y + diff * .2 * height })
    setDrawStyle(1, 'blue', 'solid', 'blue')
    drawCircle({ x, y }, 3)


}

function setLineCoords(idx, lines, canvasWidth, canvasHeight, align) {
    const linesCount = lines.length
    const x = getXByAlignment(align, idx)
    if (linesCount === 1) return { x, y: lines[0].size }
    const potentialHeight = canvasHeight - lines[0].size - 2 * MARGIN
    const y = potentialHeight * idx / (linesCount - 1) + lines[0].size + MARGIN
    setLinePos({ x, y, angle: 0 }, idx)
    return { x, y }
}

function isTooBig(line) {
    const width = getElemetWidth(line)
    return (width > gElCanvas.width - 2 * MARGIN || line.size > gElCanvas.height - 2 * MARGIN)
}

function isOnTheEdge(line, diff, idx) {
    const { x, y } = line
    let size = line.size + 1
    const width = getElemetWidth(line)
    if (!diff || idx === undefined) return (x + width > gElCanvas.width + MARGIN || y - size < MARGIN)
    return (x + diff.x <= MARGIN && diff.x < 0 || y + diff.y - line.size <= MARGIN && diff.y < 0 ||
        x + diff.x + width >= gElCanvas.width - MARGIN && diff.x > 0 || y + diff.y >= gElCanvas.height - MARGIN && diff.y > 0)
}

function fixPos(line) {
    const width = getElemetWidth(line)
    let x = line.x
    let y = line.y
    if (width + x > gElCanvas.width + MARGIN) x--
    if (y - line.size < MARGIN) y++
    setLinePos({ x, y, idx: getMeme().selectedLineIdx })
}

function calculateNewY(y, size) {
    if (y - size < MARGIN) return size + MARGIN
    if (y > gElCanvas.height - MARGIN) return gElCanvas.height - MARGIN
    return y

}

// function drawRect({ x, y }, { a, b, c, d }) {
//     gCtx.beginPath()
//     gCtx.lineWidth = 1
//     gCtx.strokeStyle = 'blue'
//     gCtx.moveTo(a.x + x, y + a.y)
//     gCtx.lineTo(b.x + x, y + b.y)
//     gCtx.lineTo(c.x + x, y + c.y)
//     gCtx.lineTo(d.x + x, y + d.y)
//     gCtx.closePath()
//     gCtx.stroke()
// }

function getRectPositions(start, angle, width, height) {
    const { x, y } = start

    const a = { x, y }
    const d = {
        x: width * Math.cos(angle) + x,
        y: -width * Math.sin(angle) + y
    }
    const b = {
        x: -height * Math.sin(angle) + x,
        y: -height * Math.cos(angle) + y
    }
    const c = {
        x: width * Math.cos(angle) - height * Math.sin(angle) + x,
        y: -width * Math.sin(angle) - height * Math.cos(angle) + y
    }
    return { a, b, c, d }
}

function calculateAngularMovement(line, mousePos) {
    const center = getElementsCenter(line)
    const distance = getDistance(center, mousePos)
    return Math.acos((mousePos.y - center.y) / distance) * ((mousePos.x - line.x) > 0 ? 1 : -1) + Math.PI * (mousePos.y < line.y ? 1 : 0)
}

function getElementsCenter(line) {
    const width = getElemetWidth(line)
    const height = line.size
    const angle = line.angle
    const x = (width * Math.cos(angle) - height * Math.sin(angle) + 2 * line.x) / 2
    const y = (2 * line.y - width * Math.sin(angle) - height * Math.cos(angle)) / 2
    return { x, y }
}

function getDistance(a, b) {
    if (!a || !b) return Infinity
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function drawCircle({ x, y }, radius) {
    gCtx.beginPath()
    gCtx.arc(x, y, radius, 0, 2 * Math.PI)
    gCtx.stroke()
    gCtx.fill()
}

function getElemetWidth(element) {
    setTextStyle(element)
    const width = gCtx.measureText(element.txt).width
    return width
}

function setRotationCenter(idx) {
    if (idx === -1) return gRotateCenter = { x: 0, y: 0 }
    const line = getMeme().lines[idx]
    gRotateCenter = getElementsCenter(line)
}