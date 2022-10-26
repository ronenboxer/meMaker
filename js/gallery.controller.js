'use strict'

function onGalleryInit(){
    document.querySelector('.meme-section').classList.add('hidden')
    document.querySelector('.gallery-section').classList.remove('hidden')
    renderGallery()
}

function renderGallery(){
    const imgs = getImgs()
    document.querySelector('.gallery-container').innerHTML = imgs.map(img =>{
        return `<artice class="gallery-img" data-id="${img.id}" style="background-image: url(${img.url});"
        onclick="onSelectImage(${img.id})"></artice>`
    }).join('')
}

function onSelectImage(imgId){
    setMeme(imgId)
    onMemeInit()
}