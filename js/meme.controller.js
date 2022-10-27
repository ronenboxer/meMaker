'use strict'

const LINE_STYLES = {
    solid: [],
    dashed: [3, 3],
}
const STEP_SIZE = 10

let gElCanvas
let gCtx
let selectedLine = null

function onMemeInit() {
    document.querySelector('.gallery-section').classList.add('hidden')
    document.querySelector('.meme-section').classList.remove('hidden')
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    addListeners()
    renderMeme()
}

function addListeners() {
    window.addEventListener('resize', resizeCanvas)
    addMouselisteners()
}

function addMouselisteners() {
    gElCanvas.addEventListener('mousedown', onDown)
    // document.querySelector('html').addEventListener('mousedown', onDown)
    addDesignConatinerListeners()
}

function addDesignConatinerListeners() {
    const memeInputs = document.querySelector('.design-container')
    memeInputs.querySelector('.text-input.meme-text').addEventListener('input', onTextInput)
    memeInputs.querySelectorAll('.color').forEach(input => input.addEventListener('input', () => onSetTextProp(event.target.dataset.id, event.target.value)))
    memeInputs.querySelectorAll('.meme-button.size').forEach(button => button.addEventListener('click', onChangeFontSize))
    memeInputs.querySelector('.meme-button.selector').addEventListener('click', onSelectNextLine)
    memeInputs.querySelectorAll('.meme-button.move').forEach(button => button.addEventListener('click', onMoveLine))
    memeInputs.querySelectorAll('.meme-button.align').forEach(button => button.addEventListener('click', ev => onSetTextProp('align', event.target.dataset.direction)))
    memeInputs.querySelector('.meme-button.add').addEventListener('click', onAddLine)
}

function renderMeme() {
    const meme = getMeme()
    if (!meme) return
    drawMeme(meme)
    const idx = meme.selectedLineIdx
    if (idx !== -1) setMemeDesignVals(meme.lines[idx])
}

function onDown(ev) {
    gElCanvas.addEventListener('mouseup', onUp)
    if (ev.target !== gElCanvas) setSelectedLine(-1)
    else {
        const { offsetX: x, offsetY: y } = ev
        const meme = getMeme()
        if (checkRotate(ev)) return
        else checkLines(meme, { x, y })
    }
}

function checkRotate(ev) {
    // const meme = getMeme()
    // const line = meme.lines[meme.selectedLineIdx]
    // if (!line) return
    // const { x, y } = line
    // const { a, b, c, d } = getRectPositions({ x, y }, line.angle, getElemetWidth(line), 0)
    // const lineBottomCenter = { x: (a.x + d.x) / 2, y: (a.y + d.y) / 2 }
    // const distance = getDistance({ x: ev.offsetX, y: ev.offsetY }, lineBottomCenter)
    // if (distance <= 10) {
    //     onRotateElement({ x: ev.offsetX, y: ev.offsetY })
    //     gElCanvas.addEventListener('mousemove', onRotateElement)
    //     return true
    // }
    return false
}

function onRotateElement({ x, y }) {
    gElCanvas.addEventListener('mouseup', onUp)
    const meme = getMeme()
    const line = meme.lines[meme.selectedLineIdx]
    const angle = calculateAngularMovement(line, { x, y })
    setTextProp('angle', angle)
    renderMeme()
}

function onMove(ev) {
    const meme = getMeme()
    const line = meme.lines[meme.selectedLineIdx]
    const { movementX: x, movementY: y } = ev
    if (isOnTheEdge(line, { x, y }, selectedLine)) return
    setLinePos({ x: x + line.x, y: y + line.y })
    setTextProp('align', 'none')
    renderMeme()
}

function onUp() {
    gElCanvas.removeEventListener('mousemove', onMove)
    gElCanvas.removeEventListener('mousemove', onRotateElement)
    gElCanvas.removeEventListener('mouseup', onUp)
    setRotationCenter(-1)
}

function checkLines(meme, { x, y }) {
    const isOnLine = meme.lines.some((line, idx) => {
        const height = line.size
        const width = getElemetWidth(line)
        const { x: lineX, y: lineY } = line
        if (x >= lineX && x <= lineX + width &&
            y <= lineY && y >= lineY - height) {
            setSelectedLine(idx)
            gElCanvas.addEventListener('mousemove', onMove)
            selectedLine = idx
            setRotationCenter(idx)
            return true
        }
    })
    if (!isOnLine) setSelectedLine(-1)
    renderMeme()
}

// function markSelectedLine() {
//     const meme = getMeme()
//     const idx = meme.selectedLineIdx
//     if (idx === -1) return
//     const lines = meme.lines
//     const currLine = lines[idx]
//     setTextStyle(line)
//     const width = gCtx.measureText(currLine.txt).width
//     const { x, y } = currLine
//     setDrawStyle(1, 'blue')
//     drawRect({ x, y, width, height: currLine.size })
// }

function onTextInput(ev) {
    setTextProp('txt', ev.target.value)
    renderMeme()
}

function onSetTextProp(prop, value) {
    const meme = getMeme()
    if (meme.selectedLineIdx === -1) return
    setTextProp(prop, value)
    renderMeme()

}

function onChangeFontSize(ev) {
    const meme = getMeme()
    if (meme.selectedLineIdx === -1) return

    const line = meme.lines[meme.selectedLineIdx]
    const currFontSize = line.size
    const diff = +ev.target.dataset.direction
    const nextVal = currFontSize + diff
    if (diff === 1 && isTooBig(line)) return
    else if (diff === 1 && isOnTheEdge(line, 'size')) fixPos(line)
    setTextProp('size', nextVal)
    renderMeme()
}

function setMemeDesignVals(line) {
    const memeInputs = document.querySelector('.design-container')
    memeInputs.querySelector('.meme-text').value = line.txt === 'Enter Text' ? '' : line.txt
    memeInputs.querySelectorAll('button.size').forEach(button => button.dataset.size = line.size)

}

function onSelectNextLine(ev) {
    const meme = getMeme()
    const linesCount = meme.lines.length
    const nextLine = meme.selectedLineIdx === -1 ? 0 : (meme.selectedLineIdx + 1 + linesCount) % linesCount
    setSelectedLine(nextLine)
    renderMeme()
}

function onMoveLine(ev) {
    const meme = getMeme()
    const idx = meme.selectedLineIdx
    if (idx === -1) return
    const line = meme.lines[idx]
    const diff = +ev.target.dataset.direction * STEP_SIZE
    const y = line.y + diff
    setLinePos({ y: calculateNewY(y, line.size), idx })
    setTextProp('align', 'none')
    renderMeme()
}

function onAddLine() {
    addLine(gElCanvas.height)
    renderMeme()
}
