'use strict'


const LINKS = {
    gallery: onGalleryInit,
    meme: onToggleSavedMemesMenu,
    lucky: () => 0,
    about: () => 0
}

document.body.onload = onInit()

function onInit() {
    addNavListeners()
    onGalleryInit()
}


function addNavListeners() {
    document.querySelectorAll('.main-header .main-nav li a').forEach(link => {
        link.addEventListener('click', LINKS[link.dataset.id])
        link.addEventListener('touchstart', LINKS[link.dataset.id])
    })
}

function onToggleSavedMemesMenu() {
    const elDropdownMenu = document.querySelector('.main-header .main-nav .dropdown-header .dropdown-menu')
    if (!elDropdownMenu.classList.contains('active')) elDropdownMenu.innerHTML = getAllMemes().map(meme => {
        return `<li class="meme" data-id="${meme.id}">
        <img src="${meme.src}" data-id="${meme.id}" onclick="setMeme('${meme.id}'); onMemeInit()" "alt="fuck">
        </li>`
    }).join('')
    elDropdownMenu.classList.toggle('active')
}
