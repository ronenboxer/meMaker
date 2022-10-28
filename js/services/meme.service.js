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
    const txt = 'Enter Text'
    const font = 'Impact'
    const size = DEFUALT_SIZE
    const strokeSize = 1
    const strokeColor = 'white'
    const align = 'center'
    const color = 'black'
    const angle = 0
    const line = { y, txt, font, size, strokeColor, strokeSize, align, color, angle }
    getXByAlignment(line)
    gMeme.lines.push(line)
    gMeme.selectedLineIdx = gMeme.lines.length - 1


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
    if (gMemes[memeId]) gMeme = gMemes[memeId]
}

function setLinePos({ x, y, angle }, idx = gMeme.selectedLineIdx) {
    if (idx === -1) return
    if (!isNaN(y)) gMeme.lines[idx].y = y
    if (!isNaN(x)) gMeme.lines[idx].x = x
    if (!isNaN(angle)) gMeme.lines[idx].angle = angle


}

function setTextProp(prop, value, idx = gMeme.selectedLineIdx) {
    if (idx === -1) return
    const line = gMeme.lines[idx]
    line[prop] = value


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