'use strict'

function onGalleryInit(){
    onCloseSavedMemesMenu()
    document.querySelector('.meme-section').classList.add('hidden')
    document.querySelector('.gallery-section').classList.remove('hidden')
    addGalleryListeners()
    setFilter('')
    renderGallery()
}

function renderGallery(){
    const imgs = getFilteredImgs()
    document.querySelector('.gallery-container').innerHTML = imgs.map(img =>{
        return `<artice class="gallery-img" data-id="${img.id}" style="background-image: url(${img.url});"
        onclick="onCreateMeme(${img.id})"></artice>`
    }).join('')
}
function addGalleryListeners(){
    // document.querySelector('.gallery-nav #file-input').addEventListener('input', onUploadimg)
    document.querySelector('.gallery-section .gallery-nav .text-filter').addEventListener('input', onSetFilter)
}

function onCreateMeme(imgId){
    createMeme(imgId)
    onMemeInit()
}

function onSetFilter(ev){
    setFilter(ev.target.value)
    renderSearchDataList(ev.target.value)
    renderGallery()
}

function renderSearchDataList(){
    document.querySelector('datalist#possible-imgs').innerHTML = getFilteredKeywordMap().map(word=>{
        return `<option value="${word}"></option>`
    }).sort((word1, word2)=>word1.localeCompare(word2)).join('')
}