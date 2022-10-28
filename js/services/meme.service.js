'use strict'


const DEFUALT_SIZE = 30
const MEME_SOTAGE_KEY = 'memeDB'
const KEYWORDS_STORAGE_KEY = 'keywordsDB'
let gMemeImgs = [
    { id: 1, keywords: ['trump', 'politics', 'arrogant'] },
    { id: 2, keywords: ['dogs', 'cute', 'love'] },
    { id: 3, keywords: ['lazy', 'dogs', 'baby', 'white', 'bed', 'cosy', 'fluffy'] },
    { id: 4, keywords: ['cat', 'computer', 'hightech', 'lazy', 'uninterested', 'indifferent'] },
    { id: 5, keywords: ['baby', 'beach', 'success', 'irony'] },
    { id: 6, keywords: ['asians', 'hallmark', `curly hair don't care`, 'unbelieveble'] },
    { id: 7, keywords: ['baby', 'amazed', 'into it', 'black', 'standing'] },
    { id: 8, keywords: ['tell me more', 'sracasm', 'mad hatter'] },
    { id: 9, keywords: ['mischiveous', 'asian', 'greedy', 'baby'] },
    { id: 10, keywords: ['obama', 'politics', 'laughing', 'black', 'hood', 'winner'] },
    { id: 11, keywords: ['boxing', 'homo', 'sweat', 'sports'] },
    { id: 12, keywords: ['jesus', 'preacher'] },
    { id: 13, keywords: ['cheers', 'leonardo', 'champange', 'toast', 'patronizing'] },
    { id: 14, keywords: ['matrix', 'morfius', 'choice', 'pills', 'virtual', 'mysterious'] },
    { id: 15, keywords: ['lotr', 'ticked off', 'not funny'] },
    { id: 16, keywords: ['star wars', 'oh really', 'patronizing'] },
    { id: 17, keywords: ['vladimir', 'putin', 'politics', 'holocaust', 'russia'] },
    { id: 18, keywords: ['toy', 'story', 'buzz', 'everywhere', 'annoyed', 'pleased'] },
]
let gKeyWords = _loadKeywords()
let gMemes = _loadMemes() || {}
let gTxtFilter = ''
let gMeme

if (!gKeyWords) {
    gKeyWords = {}
    initKeywords()
}

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
    const line  = {y, txt, font, size, strokeColor, strokeSize, align, color, angle}
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


function uploadImg(img) {
    var reader = new FileReader()
    reader.readAsDataURL(img)
    reader.onloadend = ev => {
        createMeme(makeId())
        gMeme.url = ev.target.result


        onMemeInit()
    }
}

function deleteline() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = -1


}

function mapKeyWords() {
    gMemeImgs.forEach(img => {
        img.keywords.forEach(word => {
            if (!gKeyWords[word]) gKeyWords[word] = 0
            gKeyWords[word]++
        })
    })
    _saveKeywords()
}

function resetKeyWords() {
    for (var word in gKeyWords) {
        gKeyWords[word] = 16
    }
    _saveKeywords()
}

function initKeywords() {
    mapKeyWords()
    // resetKeyWords()
    return gKeyWords
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

function _saveKeywords() {
    saveToStorage(KEYWORDS_STORAGE_KEY, gKeyWords)
}

function _loadKeywords() {
    return loadFromStorage(KEYWORDS_STORAGE_KEY)
}

function setFilter(txt) {
    if (txt === undefined || txt === null) return
    gTxtFilter = txt
}

function getFilteredMemeId() {
    let ids = []
    gMemeImgs.forEach(img => {
        img.keywords.forEach(word => {
            if (word.toLocaleLowerCase().startsWith(gTxtFilter.toLocaleLowerCase())) {
                if (!ids.includes(img.id)) ids.push(img.id)
            }
        })
    })
    return ids
}

function getFilteredKeywordMap() {
    let keywords = []
    for (let word in gKeyWords) {
        if (word.toLocaleLowerCase().startsWith(gTxtFilter.toLocaleLowerCase())) keywords.push(word)
    }
    return keywords
}