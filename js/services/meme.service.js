'use strict'


const DEFUALT_SIZE = 30
const MEME_SOTAGE_KEY = 'memeDB'
let gMemes = _loadMemes() || {}
let gMeme


function createMeme(imgId) {
    gMeme = {
        imgId,
        selectedLineIdx: 0,
        url: `square.imgs/${imgId}.jpg`,
        lines: [
            {
                txt: 'BE FUNNY',
                font: 'Impact',
                size: DEFUALT_SIZE,
                strokeSize: 1,
                strokeColor: 'white',
                align: 'center',
                color: 'black'
            },
            {
                txt: 'BE FUNNY',
                font: 'Impact',
                size: DEFUALT_SIZE,
                strokeSize: 0,
                strokeColor: 'white',
                align: 'center',
                color: 'black'
            },
        ]
    }
}

function addLine(height) {
    if (!gMeme) return
    const y = (height - DEFUALT_SIZE) / 2
    const txt = 'BE FUNNY'
    const font = 'Impact'
    const size = DEFUALT_SIZE
    const strokeSize = 1
    const strokeColor = 'white'
    const align = 'center'
    const color = 'black'
    const line = { y, txt, font, size, strokeColor, strokeSize, align, color }
    gMeme.lines.push(line)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
    getXByAlignment(line)


}

function getMeme() {
    return gMeme
}

function getAllMemes() {
    let memes = []
    for (var memeId in gMemes) {
        memes.push(gMemes[memeId])
    }
    return memes
}

function setMeme(memeId) {
    gMemes = _loadMemes()
    if (gMemes[memeId]) gMeme = gMemes[memeId]
}

function setLinePos({ x, y }, idx = gMeme.selectedLineIdx) {
    if (idx === -1) return
    setTextProp('y', y, idx)
    setTextProp('x', x, idx)


}

function setTextProp(prop, value, idx = gMeme.selectedLineIdx) {
    if (idx === -1 || !prop || value === null || value === undefined) return
    const line = gMeme.lines[idx]
    line[prop] = value
}

function translateTextDims(canvasWidth, canvasHeight, idx) {
    if (isNaN(idx) || idx === -1) return
    const line = gMeme.lines[idx]
    const yRatio = canvasHeight / line.canvasHeight
    const xRatio = canvasWidth / line.canvasHeight
    if (xRatio === 1 && yRatio === 1) return
    setTextProp('x', line.x * xRatio, idx)
    setTextProp('y', line.y * yRatio, idx)
    setTextProp('size', line.size * yRatio, idx)
    setTextProp('width', getElemetWidth(line), idx)
    setTextProp('canvasWidth', canvasWidth, idx)
    setTextProp('canvasHeight', canvasHeight, idx)
}

function setSelectedLine(idx) {
    if (!gMeme) return
    gMeme.selectedLineIdx = idx
}


function deleteline() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = -1
}

function saveNewMeme(imgSrc) {
    gMeme.src = imgSrc
    if (!gMeme.id) gMeme.id = makeId()
    gMemes[gMeme.id] = getHardCopy(gMeme)
    _saveMemes()
}

function _saveMemes() {
    saveToStorage(MEME_SOTAGE_KEY, gMemes)
}

function _loadMemes() {
    return loadFromStorage(MEME_SOTAGE_KEY)
}