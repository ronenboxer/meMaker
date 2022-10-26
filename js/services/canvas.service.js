'use strict'

const margin = 3

function setDrawStyle(width = 1, stroke = 'black', strokeLineStyle = 'solid', color = 'black', size = '20', font = 'Impcat') {
    gCtx.lineWidth = width
    gCtx.strokeStyle = stroke
    gCtx.setLineDash(gStrokLineStyles[strokeLineStyle])
    gCtx.fillStyle = color
    gCtx.font = `${size}px ${font}`
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
            const width = gCtx.measureText(line.txt).width
            drawRect({ x, y, width, height: line.size })
        }
    }
}

function drawImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function drawLines() {
    const meme = getMeme()
    meme.lines.forEach((line, idx) => {
        const { txt, font, size, align, color } = line
        setDrawStyle(line.strokeSize, line.strokeColor, 'solid', color, size, font)
        if (line.x && line.y) return drawText({ txt, font, size, x: line.x, y: line.y, color })
        const { x, y } = getTextCoords(idx, meme.lines, 500, 500, 'left')
        setLinePos({ x, y, idx })
        drawText({ txt, font, size, x, y, color })
    })
}

function drawText({ txt, x, y }) {
    gCtx.fillText(txt, x, y)
    gCtx.strokeText(txt, x, y)
}

function drawRect({ x, y, width, height }) {
    setDrawStyle(1, 'blue')
    gCtx.strokeRect(x - 1, y - height + 2, width + 2, height + 2)
}

function getTextCoords(lineIdx, lines, width, height, align) {
    const linesCount = lines.length
    const x = margin
    if (linesCount === 1) return { x, y: lines[0].size }
    const potentialHeight = height - lines[0].size - 2 * margin
    const y = potentialHeight * lineIdx / (linesCount - 1) + lines[0].size + margin
    return { x, y }
}

function isOnTheEdge(line) {
    const { x, y } = line
    const { stokreSize, strokeColor, color, size, font } = line
    size++
    setDrawStyle(stokreSize, strokeColor, 'solid', color, size, font)
    const width = gtc.measureText(line.txt).width
    return (x + width > 500 + margin || y - size < margin)
}