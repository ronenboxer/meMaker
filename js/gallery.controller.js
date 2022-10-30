'use strict'

function onGalleryInit() {
    onCloseSavedMemesMenu()
    document.querySelector('.meme-section').classList.add('hidden')
    // document.querySelector('.gallery-section').classList.remove('hidden')
    renderMostSearched()
    addGalleryListeners()
    setFilter('')
    renderGallery()
}


function renderMostSearched() {
    const elMostSearched = document.querySelectorAll('p.most-searched')
    const keywordMap = getKeywordMap()
    let sortedWords = []
    for (var word in keywordMap) {
        sortedWords.push({ word, times: keywordMap[word] })
    }
    sortedWords.sort((word1, word2) => word2.times - word1.times)
    let paragraphContent = sortedWords.map(word => `<a class="most-searched" href="#"
    onclick="onUpdateKeywordMap('${word.word}')"
    style="font-size: ${word.times * 10 + 5}px; color:${getRandomColor()} !important;">${word.word}</a>`).join('')
    elMostSearched.forEach(paragraph => paragraph.innerHTML = paragraphContent)
}

function renderGallery() {
    const imgs = getFilteredImgs()
    document.querySelector('.gallery-container').innerHTML = imgs.map(img => {
        return `<artice class="gallery-img" data-id="${img.id}" style="background-image: url(${img.url});"
        onclick="onCreateMeme(${img.id})"></artice>`
    }).join('')
}
function addGalleryListeners() {
    // document.querySelector('.gallery-nav #file-input').addEventListener('input', onUploadimg)
    document.querySelector('.gallery-section .gallery-nav .text-filter').addEventListener('input', onSetFilter)
    document.querySelector('.meme-section .search .text-filter').addEventListener('input', onSetFilter)
}

function onCreateMeme(imgId) {
    createMeme(imgId)
    onMemeInit()
}

function onSetFilter(ev) {
    setFilter(ev.target.value)
    renderSearchDataList(ev.target.value)
    renderGallery()
}

function renderSearchDataList() {
    document.querySelector('datalist#possible-imgs').innerHTML = getFilteredKeywordMap().map(word => {
        return `<option value="${word}"></option>`
    }).sort((word1, word2) => word1.localeCompare(word2)).join('')
}

function onUpdateKeywordMap(keyword) {
    updateKeywordsMap(keyword)
    setFilter(keyword)
    renderMostSearched()
    renderGallery()
}