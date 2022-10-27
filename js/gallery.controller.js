'use strict'

function onGalleryInit(){
    document.querySelector('.meme-section').classList.add('hidden')
    document.querySelector('.gallery-section').classList.remove('hidden')
    renderGallery()
    document.querySelector('.gallery-nav #file-input').addEventListener('input', onUploadimg)
}

function renderGallery(){
    const imgs = getImgs()
    document.querySelector('.gallery-container').innerHTML = imgs.map(img =>{
        return `<artice class="gallery-img" data-id="${img.id}" style="background-image: url(${img.url});"
        onclick="onCreateMeme(${img.id})"></artice>`
    }).join('')
}

function onCreateMeme(imgId){
    createMeme(imgId)
    onMemeInit()
}

function onUploadimg(ev){
    uploadImg(ev.target.files[0])
}