'use strict'

const IMGS_STORAGE_KEY = 'imgsDB'
const KEYWORDS_STORAGE_KEY = 'keywordsDB'
let gImgs = _loadImgs()
let gKeywordsMap = _loadKeywords()
let gTxtFilter = ''
mapKeyWords()

function getImgById(imgId) {
    return gImgs.find(img => img.id == imgId)
}

function uploadImg(img) {
    var reader = new FileReader()
    reader.readAsDataURL(img)
    reader.onloadend = ev => {
        createMeme(makeId())
        gMeme.url = ev.target.result
        gImgs.push({
            id: makeId(),
            url: img.src
        })
        _saveImgs()
        onMemeInit()
    }
}

function updateImgKeywords(imgId, keywords) {
    let img = gImgs.find(img => img.id === imgId)
    if (!img) return
    if (!img.keywords) img.keywords = []
    keywords.forEach(keyword => {
        const idxOfOldVal = img.keywords.indexOf(keyword.oldVal)
        if (idxOfOldVal !== -1) {
            if (!img.keywords.includes(keyword.newVal)) img.keywords[idxOfOldVal] = keyword.newVal
        }
        else if (!img.keywords.includes(keyword.newVal)) img.keywords.push(keyword.newVal)
    })
    _saveImgs()
    gKeywordsMap = {}
    mapKeyWords()
}

function deleteImgKeywords(imgId, keywords) {
    let img = gImgs.find(img => img.id === imgId)
    if (!img || !img.keywords || !img.keywords.length) return
    keywords.forEach(keyword => {
        const idx = img.keywords.indexOf(keyword)
        if (idx !== -1) img.keywords.splice(idx, 1)
    })
    _saveImgs()
    gKeywordsMap = {}
    mapKeyWords()
}

function deleteImg(imgId) {
    const idx = gImgs.findIndex(img => img.id === imgId)
    if (idx === -1) return
    gImgs.splice(idx, 1)
    _saveImgs()
}

function initKeywords() {
    mapKeyWords()
    resetKeyWords()
    return gKeywordsMap
}

function mapKeyWords() {
    gImgs.forEach(img => {
        img.keywords.forEach(word => {
            if (!gKeywordsMap[word]) gKeywordsMap[word] = 0
            gKeywordsMap[word]++
        })
    })
}

function resetKeyWords() {
    for (var word in gKeywordsMap) {
        gKeywordsMap[word] = 16
    }
}

function setFilter(txt) {
    if (txt === undefined || txt === null) return
    gTxtFilter = txt
}

function getFilteredKeywordMap() {
    let keywords = []
    for (let word in gKeywordsMap) {
        if (word.toLocaleLowerCase().startsWith(gTxtFilter.toLocaleLowerCase())) keywords.push(word)
    }
    return keywords
}

function getKeywordMap(){
    return gKeywordsMap
}

function updateKeywordsMap(keyword){
    gKeywordsMap[keyword]++
    _saveKeywords(KEYWORDS_STORAGE_KEY)
}

function getFilteredImgs(filter = gTxtFilter) {
    const ids = getFilteredMemeId(filter)
    return gImgs.filter(img => {
        if (filter === 'all') return true
        return ids.includes(img.id)
    })
}

function getFilteredMemeId(filter) {
    let ids = []
    gImgs.forEach(img => {
        img.keywords.forEach(word => {
            if (word.toLocaleLowerCase().startsWith(filter.toLocaleLowerCase())) {
                if (!ids.includes(img.id)) ids.push(img.id)
            }
        })
    })
    return ids
}


function _saveKeywords(){
    saveToStorage(KEYWORDS_STORAGE_KEY, gKeywordsMap)
}

function _loadKeywords(){
    const keywords =  loadFromStorage(KEYWORDS_STORAGE_KEY)
    if (!keywords || !keywords.length) return {}
    return keywords
}

function _saveImgs() {
    saveToStorage(IMGS_STORAGE_KEY, gImgs)
}

function _loadImgs() {
    const imgs = loadFromStorage(IMGS_STORAGE_KEY)
    if (imgs && imgs.length) return imgs
    return [
        {
            id: 1,
            url: 'square.imgs/1.jpg',
            keywords: ['trump', 'politics', 'arrogant']
        },
        {
            id: 2,
            url: 'square.imgs/2.jpg',
            keywords: ['dogs', 'cute', 'love']
        },
        {
            id: 3,
            url: 'square.imgs/3.jpg',
            keywords: ['lazy', 'dogs', 'baby', 'white', 'bed', 'cosy', 'fluffy']
        },
        {
            id: 4,
            url: 'square.imgs/4.jpg',
            keywords: ['cat', 'computer', 'hightech', 'lazy', 'uninterested', 'indifferent']
        },
        {
            id: 5,
            url: 'square.imgs/5.jpg',
            keywords: ['baby', 'beach', 'success', 'irony']
        },
        {
            id: 6,
            url: 'square.imgs/6.jpg',
            keywords: ['asians', 'hallmark', `curly hair don't care`, 'unbelieveble']
        },
        {
            id: 7,
            url: 'square.imgs/7.jpg',
            keywords: ['baby', 'amazed', 'into it', 'black', 'standing']
        },
        {
            id: 8,
            url: 'square.imgs/8.jpg',
            keywords: ['tell me more', 'sracasm', 'mad hatter']
        },
        {
            id: 9,
            url: 'square.imgs/9.jpg',
            keywords: ['mischiveous', 'asian', 'greedy', 'baby']
        },
        {
            id: 10,
            url: 'square.imgs/10.jpg',
            keywords: ['obama', 'politics', 'laughing', 'black', 'hood', 'winner']
        },
        {
            id: 11,
            url: 'square.imgs/11.jpg',
            keywords: ['boxing', 'homo', 'sweat', 'sports']
        },
        {
            id: 12,
            url: 'square.imgs/12.jpg',
            keywords: ['jesus', 'preacher']
        },
        {
            id: 13,
            url: 'square.imgs/13.jpg',
            keywords: ['cheers', 'leonardo', 'champange', 'toast', 'patronizing']
        },
        {
            id: 14,
            url: 'square.imgs/14.jpg',
            keywords: ['matrix', 'morfius', 'choice', 'pills', 'virtual', 'mysterious']
        },
        {
            id: 15,
            url: 'square.imgs/15.jpg',
            keywords: ['lotr', 'ticked off', 'not funny']
        },
        {
            id: 16,
            url: 'square.imgs/16.jpg',
            keywords: ['star wars', 'oh really', 'patronizing']
        },
        {
            id: 17,
            url: 'square.imgs/17.jpg',
            keywords: ['vladimir', 'putin', 'politics', 'holocaust', 'russia']
        },
        {
            id: 18,
            url: 'square.imgs/18.jpg',
            keywords: ['toy', 'story', 'buzz', 'everywhere', 'annoyed', 'pleased']
        }
    ]
}