'use strict'

const gStrokLineStyles = {
    solid: [],
    dashed: [3, 3],
}

let gElCanvas
let gCtx

function onMemeInit() {
    document.querySelector('.gallery-section').classList.add('hidden')
    document.querySelector('.meme-section').classList.remove('hidden')
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    renderMeme()
}

function addListeners() {
    addMouselisteners()
}

function addMouselisteners() {
    gElCanvas.addEventListener('click', onDown)
    addDesignConatinerListeners()
}

function addDesignConatinerListeners() {
    const memeInputs = document.querySelector('.design-container')
    memeInputs.querySelector('.text-color').addEventListener('input', () => onSetTextProp('color', event))
    memeInputs.querySelectorAll('.meme-button.size').forEach(button => button.addEventListener('click', onChangeFontSize))
    memeInputs.querySelectorAll('.meme-button.selector').forEach(button => button.addEventListener('click', onSelectNextLine))
}

function renderMeme() {
    const meme = getMeme()
    drawMeme(meme)
    const idx = meme.selectedLineIdx
    if (idx !== -1) setMemeDesignVals(meme.lines[idx])
}

function onDown(ev) {
    const { offsetX: x, offsetY: y } = ev
    const meme = getMeme()
    checkLines(meme, { x, y })
    renderMeme()
}

function checkLines(meme, { x, y }) {
    const isOnLine = meme.lines.some((line, idx) => {
        const height = line.size
        setDrawStyle(line.strokeSize, line.strokeColor, 'solid', line.color, line.size, line.font)
        const width = gCtx.measureText(line.txt).width
        const { x: lineX, y: lineY } = line
        if (x >= lineX && x <= lineX + width &&
            y <= lineY && y >= lineY - height) {
            setSelectedLine(idx)
            return true
        }
    })
    if (!isOnLine) setSelectedLine(-1)
}

function markSelectedLine() {
    const meme = getMeme()
    const idx = meme.selectedLineIdx
    if (idx === -1) return
    const lines = meme.lines
    const currLine = lines[idx]
    setDrawStyle(currLine.strokeSize, currLine.strokeColor, 'solid', currLine.txt, currLine.size, currLine.font)
    const width = gCtx.measureText(currLine.txt).width
    const { x, y } = currLine
    setDrawStyle(1, 'blue')
    drawRect({ x, y, width, height: currLine.size })
}

function onUpdateText(ev) {
    setTextProp('txt', ev.target.value)
    renderMeme()
}

function onSetTextProp(prop, ev) {
    const meme = getMeme()
    if (meme.selectedLineIdx !== -1) setTextProp(prop, ev.target.value)
    else switch (prop) {
        case 'color': setDrawStyle(2, 'black', 'solid', ev.target.value, 16, 'Impact')
            break
    }
}

function onChangeFontSize(ev) {
    const meme = getMeme()
    if (meme.selectedLineIdx === -1) return
    const currFontSize = meme.lines[meme.selectedLineIdx].size
    const diff = +ev.target.dataset.direction
    const nextVal = currFontSize + diff
    setTextProp('size', nextVal)
}

function setMemeDesignVals(line) {
    const memeInputs = document.querySelector('.design-container')
    memeInputs.querySelector('.meme-text').value = line.txt
    memeInputs.querySelectorAll('button.size').forEach(button => button.dataset.size = line.size)

}

function onSelectNextLine(ev) {
    const meme = getMeme()
    const linesCount = meme.lines.length
    const nextLine = meme.selectedLineIdx === -1 ? 0 : (meme.selectedLineIdx + (+ev.target.dataset.direction) + linesCount) % linesCount
    setSelectedLine(nextLine)
    renderMeme()
}