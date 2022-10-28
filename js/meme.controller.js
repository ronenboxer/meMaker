'use strict'

const STEP_SIZE = 10

let gElCanvas
let gCtx
let selectedLine = null
let lastGrabPos

function onMemeInit() {
    onCloseSavedMemesMenu()
    if (!getMeme()) return
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
    addTouchlisteners()
}

function addMouselisteners() {
    gElCanvas.addEventListener('mousedown', onDown)
    // document.querySelector('html').addEventListener('mousedown', onDown)
    addMouseDesignConatinerListeners()
}
function addTouchlisteners() {
    gElCanvas.addEventListener('touchstart', onDown)
    addTouuchDesignConatinerListeners()
}

function addMouseDesignConatinerListeners() {
    const memeInputs = document.querySelector('.design-container')
    memeInputs.querySelector('.text-input.meme-text').addEventListener('input', onTextInput)
    memeInputs.querySelectorAll('.color').forEach(input => input.addEventListener('input', ev => onSetTextProp(ev.target.dataset.id, ev.target.value)))
    memeInputs.querySelectorAll('.meme-button.size').forEach(button => button.addEventListener('click', onChangeFontSize))
    memeInputs.querySelector('.meme-button.selector').addEventListener('click', onSelectNextLine)
    memeInputs.querySelectorAll('.meme-button.align').forEach(button => button.addEventListener('click', ev => onSetTextProp('align', ev.target.dataset.direction)))
    memeInputs.querySelector('.meme-button.add').addEventListener('click', onAddLine)
    memeInputs.querySelector('.meme-button.delete').addEventListener('click', onDelete)
    memeInputs.querySelector('.meme-button.save').addEventListener('click', onSave)
}
function addTouuchDesignConatinerListeners() {
    const memeInputs = document.querySelector('.design-container')
    memeInputs.querySelectorAll('.meme-button.size').forEach(button => button.addEventListener('touchstart', onChangeFontSize))
    memeInputs.querySelector('.meme-button.selector').addEventListener('touchstart', onSelectNextLine)
    memeInputs.querySelectorAll('.meme-button.align').forEach(button => button.addEventListener('touchstart', ev => onSetTextProp('align', ev.target.dataset.direction)))
    memeInputs.querySelector('.meme-button.add').addEventListener('touchstart', onAddLine)
    memeInputs.querySelector('.meme-button.delete').addEventListener('touch', onDelete)
    memeInputs.querySelector('.meme-button.save').addEventListener('touch', onSave)
}

function renderMeme() {
    const meme = getMeme()
    if (!meme) return
    drawMeme(meme)
    const idx = meme.selectedLineIdx
    if (idx !== -1) setMemeDesignVals(meme.lines[idx])
}

function onDown(ev) {
    const { x, y } = getEventPositions(ev)
    lastGrabPos = { x, y }
    gElCanvas.addEventListener('mouseup', onUp)
    const meme = getMeme()
    if (checkRotate(ev)) return
    else checkMemeElements(meme, { x, y })
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

function onRotateElement({ x, y }, ev) {
    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefualt()
        ev = ev.changedTouches[0]
        x = ev.pageX - ev.target.offsetLeft - ev.target.clientLeft
        y = ev.pageY - ev.target.offsetTop - ev.target.clientTop
    }
    gElCanvas.addEventListener('mouseup', onUp)
    gElCanvas.addEventListener('touchend', onUp)
    const meme = getMeme()
    const line = meme.lines[meme.selectedLineIdx]
    const angle = calculateAngularMovement(line, { x, y })
    setTextProp('angle', angle)
    renderMeme()
}

function onMove(ev) {
    const { x, y } = getEventPositions(ev)
    const delta = getPositionsDelta(ev, lastGrabPos)
    lastGrabPos = { x, y }
    const meme = getMeme()
    const line = meme.lines[meme.selectedLineIdx]
    if (!line) return
    if (isOnTheEdge(line, delta, meme.selectedLineIdx)) return
    const newPos = {
        x: line.x + delta.x,
        y: line.y + delta.y
    }
    setLinePos(newPos)
    setTextProp('align', 'none')
    renderMeme()
}

function onUp() {
    gElCanvas.removeEventListener('mousemove', onMove)
    gElCanvas.removeEventListener('mousemove', onRotateElement)
    gElCanvas.removeEventListener('mouseup', onUp)
    gElCanvas.removeEventListener('touchmove', onMove)
    gElCanvas.removeEventListener('touchmove', onRotateElement)
    gElCanvas.removeEventListener('touchend', onUp)
    lastGrabPos = null
    setRotationCenter(-1)
}

function checkMemeElements(meme, { x, y }) {
    const isOnLine = meme.lines.some((line, idx) => {
        const { width, size: height } = line
        const { x: lineX, y: lineY } = line
        if (x >= lineX && x <= lineX + width &&
            y <= lineY && y >= lineY - height) {
            setSelectedLine(idx)
            gElCanvas.addEventListener('mousemove', onMove)
            gElCanvas.addEventListener('touchmove', onMove)
            setRotationCenter(idx)
            return true
        }
    })
    if (!isOnLine) setSelectedLine(-1)
    renderMeme()
}

function onTextInput(ev) {
    setTextProp('txt', ev.target.value)
    renderMeme()
}

function onSetTextProp(prop, value) {
    const meme = getMeme()
    if (meme.selectedLineIdx === -1) return
    const line = meme.lines[meme.selectedLineIdx]
    setTextProp(prop, value)
    if (prop ==='align') setLinePos(getXByAlignment(line))
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
    setTextProp('width', getElemetWidth(line))
    renderMeme()
}

function setMemeDesignVals(line) {
    const memeInputs = document.querySelector('.design-container')
    memeInputs.querySelector('.meme-text').value = line.txt === 'Enter Text' ? '' : line.txt
    memeInputs.querySelectorAll('button.size').forEach(button => button.dataset.size = line.size)
    document.querySelector('.meme-section .text-input.meme-text').focus()
}

function onSelectNextLine() {
    const meme = getMeme()
    const linesCount = meme.lines.length
    const nextLine = meme.selectedLineIdx === -1 ? 0 : (meme.selectedLineIdx + 1 + linesCount) % linesCount
    setSelectedLine(nextLine)
    renderMeme()
}

function onAddLine() {
    addLine(gElCanvas.height)
    renderMeme()
}

function onDelete() {
    const meme = getMeme()
    if (!meme || meme.selectedLineIdx === -1) return
    deleteline()
    renderMeme()
}

function onSave() {
    setSelectedLine(-1)
    renderMeme()
    setTimeout(() => {
        saveNewMeme(gElCanvas.toDataURL('image/jpeg'))
        onGalleryInit()
    }, 10);
}