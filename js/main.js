'use strict'

const LINKS = {
    gallery: onGalleryInit,
    meme: onMemeInit,
    lucky: ()=>0,
    about: ()=>0
}

document.body.onload = onInit()

function onInit(){
    addNavListeners()
    onGalleryInit()
}


function addNavListeners(){
    document.querySelectorAll('.main-header .main-nav li a').forEach(link =>{
        link.addEventListener('click', LINKS[link.dataset.id])
    })
}

