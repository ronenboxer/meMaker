'use strict'

const STEP_SIZE = 10

let gElCanvas
let gCtx
let selectedLine = null
let lastGrabPos

function onMemeInit() {
    onCloseSavedMemesMenu()
    if (!getMeme()) return
    // document.querySelector('.gallery-section .gallery-nav').classList.add('hidden')
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
    memeInputs.querySelectorAll('select.font').forEach(button => button.addEventListener('input', ev => onSetTextProp('font', ev.target.value)))
    memeInputs.querySelector('.meme-button.selector').addEventListener('click', onSelectNextLine)
    memeInputs.querySelectorAll('.meme-button.align').forEach(button => button.addEventListener('click', ev => onSetTextProp('align', ev.target.dataset.direction)))
    memeInputs.querySelector('.meme-button.add').addEventListener('click', onAddLine)
    memeInputs.querySelector('.meme-button.delete').addEventListener('click', onDeleteLine)
    memeInputs.querySelector('.meme-button.save').addEventListener('click', onSaveMeme)
    memeInputs.querySelector('.meme-button.share').addEventListener('click', onDownloadMeme)

    gElCanvas.addEventListener('mousemove', isHoveringAboutElement)
}

function addTouuchDesignConatinerListeners() {
    const memeInputs = document.querySelector('.design-container')
    memeInputs.querySelectorAll('.meme-button.size').forEach(button => button.addEventListener('touchstart', onChangeFontSize))
    memeInputs.querySelector('.meme-button.selector').addEventListener('touchstart', onSelectNextLine)
    memeInputs.querySelectorAll('.meme-button.align').forEach(button => button.addEventListener('touchstart', ev => onSetTextProp('align', ev.target.dataset.direction)))
    memeInputs.querySelector('.meme-button.add').addEventListener('touchstart', onAddLine)
    memeInputs.querySelector('.meme-button.delete').addEventListener('touch', onDeleteLine)
    memeInputs.querySelector('.meme-button.save').addEventListener('touch', onSaveMeme)
}

function renderMeme() {
    const meme = getMeme()
    if (!meme) return
    drawMeme(meme)
    const idx = meme.selectedLineIdx
    if (idx !== -1) setMemeDesignInputVals(meme.lines[idx])
}


function isHoveringAboutElement(ev) {
    const { offsetX: x, offsetY: y } = ev
    const meme = getMeme()
    if (checkMemeElements(meme, { x, y })) {
        gElCanvas.classList.add('grabbable')
    }
    else gElCanvas.classList.remove('grabbable')
}

function onDown(ev) {
    const { x, y } = getEventPositions(ev)
    lastGrabPos = { x, y }
    if (TOUCH_EVS.includes(ev.type)) gElCanvas.classList.add('grabbable')
    gElCanvas.addEventListener('mouseup', onUp)
    const meme = getMeme()
    if (checkMemeElements(meme, { x, y })) {
        gElCanvas.addEventListener('mousemove', onMove)
        gElCanvas.addEventListener('touchmove', onMove)
    } else setSelectedLine(-1)
    renderMeme()
}

function onMove(ev) {
    const { x, y } = getEventPositions(ev)
    gElCanvas.removeEventListener('mousemove', isHoveringAboutElement)
    const delta = getPositionsDelta(ev, lastGrabPos)
    lastGrabPos = { x, y }
    const meme = getMeme()
    const line = getSelectedLine()
    if (!line) return
    if (isOnTheEdge(line, delta, meme.selectedLineIdx)) return
    const newPos = {
        x: line.x + delta.x,
        y: line.y + delta.y
    }
    setLinePos(newPos)
    setTextProp('align', 'none')
    document.querySelectorAll('.meme-button.align.active').forEach(button => button.classList.remove('active'))
    renderMeme()
}

function onUp() {
    gElCanvas.removeEventListener('mousemove', onMove)
    gElCanvas.removeEventListener('mouseup', onUp)
    gElCanvas.removeEventListener('touchmove', onMove)
    gElCanvas.removeEventListener('touchend', onUp)
    gElCanvas.addEventListener('mousemove', isHoveringAboutElement)
    lastGrabPos = null
}

function checkMemeElements(meme, { x, y }) {
    return meme.lines.some((line, idx) => {
        const { width, size: height } = line
        const { x: lineX, y: lineY } = line
        if (x >= lineX && x <= lineX + width &&
            y <= lineY && y >= lineY - height) {
            setSelectedLine(idx)
            return true
        }
    })
}

function onTextInput(ev) {
    const line = getSelectedLine()
    if (!line) return
    const newText = ev.target.value
    if (newText.length > line.txt.length) {
        if (isTooBig(line)) return ev.target.value = line.txt
        else if (isOnTheEdge(line, 'size')) return ev.target.value = line.txt
    }
    setTextProp('txt', newText)
    setTextProp('width', getLineWidth(line))
    renderMeme()
}

function onSetTextProp(prop, value) {
    const meme = getMeme()
    if (meme.selectedLineIdx === -1) return
    const line = getSelectedLine()
    setTextProp(prop, value)
    if (prop === 'align') {
        setLinePos(getXByAlignment(line))
        document.querySelectorAll('.meme-button.align').forEach(button => {
            if (button.dataset.direction === 'align') button.classList.add('active')
            else button.classList.remove('active')
        })
    } else if (prop === 'font') setTextProp('width', getLineWidth(line))
    else if (prop === 'color') document.querySelector(`.design-container button[data-id="${prop}"]`).style.color = value
    renderMeme()
}

function onChangeFontSize(ev) {
    const meme = getMeme()
    if (meme.selectedLineIdx === -1) return
    const line = getSelectedLine()
    const currFontSize = line.size
    const diff = +ev.target.dataset.direction
    const nextFontSize = currFontSize + diff
    setTextProp('size', nextFontSize)
    if (diff === 1 && isTooBig(line)) return setTextProp('size', currFontSize)
    else if (diff === 1 && isOnTheEdge(line, 'size')) fixPos(line)
    setTextProp('width', getLineWidth(line))
    renderMeme()
}

function setMemeDesignInputVals(line) {
    if (!line) return
    const memeEditors = document.querySelector('.design-container')
    memeEditors.querySelector('.meme-text').value = line.txt === 'Enter Text' ? '' : line.txt
    memeEditors.querySelectorAll('button.size').forEach(button => button.dataset.size = line.size)
    memeEditors.querySelectorAll('button.color').forEach(button => button.style.color = line[button.dataset.id])
    memeEditors.querySelectorAll('.meme-button.align').forEach(button => {
        if (line.align === button.dataset.direction) button.classList.add('active')
        else button.classList.remove('active')
    })
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

function onDeleteLine() {
    const meme = getMeme()
    if (!meme || meme.selectedLineIdx === -1) return
    deleteline()
    renderMeme()
}

function onSaveMeme() {
    setSelectedLine(-1)
    renderMeme()
    setTimeout(() => {
        saveNewMeme(gElCanvas.toDataURL('image/jpeg'))
    }, 20);
}

function onDownloadMeme(ev) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    ev.target.href = imgContent
}


