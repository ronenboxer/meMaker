'use strict'


const LINKS = {
    gallery: onGalleryInit,
    meme: onToggleSavedMemesMenu,
    lucky: () => 0,
    about: onManageModal
}

document.body.onload = onInit()

function onInit() {
    addMainEventListeners()
    onGalleryInit()
}

function addMainEventListeners() {
    addLayoutEventListeners()
    addNavListeners()
}

function addLayoutEventListeners() {
    document.querySelector('.block-screen').addEventListener('click', onCloseAll)
}

function addNavListeners() {
    document.querySelectorAll('.main-header  .nav-link').forEach(link => {
        link.addEventListener('click', LINKS[link.dataset.id])
        link.addEventListener('touchstart', LINKS[link.dataset.id])
    })
}

function onToggleSavedMemesMenu() {
    const elDropdownMenu = document.querySelector('.main-header .main-nav .dropdown-header .dropdown-menu')
    if (!elDropdownMenu.classList.contains('active')) elDropdownMenu.innerHTML = getAllMemes().map(meme => {
        return `<li class="meme" data-id="${meme.id}">
        <img src="${meme.src}" data-id="${meme.id}" onclick="onGoToMeme('${meme.id}')">
        </li>`
    }).join('')
    elDropdownMenu.classList.toggle('active')
}

function onGoToMeme(memeId) {
    setMeme(memeId)
    onToggleSavedMemesMenu()
    onMemeInit()
}

function onCloseSavedMemesMenu() {
    document.querySelector('.main-header .main-nav .dropdown-header .dropdown-menu').classList.remove('active')
}

function onManageModal() {
    document.querySelector('.main-modal').innerHTML = `
    <h2 class="modal-header">Manage meme images</h2>
    <section class="modal-content">
    <table class="imgs-table">
        <thead>
            <tr>
                <th>Image</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    </section>
   <footer class="modal-footer flex"> 
   <label for="file-input">
            <iconify-icon inline icon="bxs:camera-plus""></iconify-icon>
            <input id="file-input" type="file" class="hidden" oninput="onUploadimg(event)"></li>
    </label>
   <button class="close-modal" onclick="onCloseAll()">Done</button></footer>`

    document.querySelector('.main-modal .imgs-table tbody').innerHTML = getFilteredImgs('all').map(img => {
        return `
        <tr>
            <td class="meme-img"><div class="img-placeholder" style="background-image: url(${img.url});"></div></td>
            <td><button class="update-btn" onclick="onUpdateImgKeywordsModal('${img.id}')"><iconify-icon icon="fa-regular:edit"></iconify-icon></button></td>
            <td><button class="delete-btn" onclick="onDeleteModal('${img.id}')"><iconify-icon icon="ant-design:delete-outline"></iconify-icon></button></td>
        </tr>`
    }).join('')
    toggleElementsDisplay('block-screen')
    toggleElementsDisplay('main-modal')
}


function onUpdateImgKeywordsModal(imgId) {
    const img = getImgById(imgId)
    if (img) {
        document.querySelector('.secondary-modal').innerHTML = `
    <h2>Udpate keywords</h2>
        <form class="modal-content" id="keywords-update" onsubmit="onUpdateKeywords(event, ${imgId})">
            <table class="imgs-keywords">
                <thead>
                    <tr>
                        <th>Keyword</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </form>
    <footer class="modal-footer flex">
        <button class="add-keyword" onclick="onAddKeywordInput()">Add</button>
        <button class="close-modal" form="keywords-update">Done</button>
        <button class="close-modal" onclick="onUpdateImgKeywordsModal()">Cancel</button>
    </footer>`

        document.querySelector('.secondary-modal table tbody').innerHTML = img.keywords.map(word => {
            return `
            <tr>
                <td class="position-relative"><input class="edit-keyword" type="text" value="${word}" data-keyword="${word}"></td>
                <td><input type="checkbox" class="delete-keyword" data-keyword="${word}"></td>
            </tr>`
        }).join('')
    }
    toggleSecondaryModal()
}

function onUpdateKeywords(ev, imgId) {
    ev.preventDefault()
    let keywordsToDelete = []
    let keywordsToUpdate = []
    ev.target.querySelectorAll('tbody tr').forEach(elTr => {
        const elKeywordCheckbox = elTr.querySelector('input.delete-keyword')
        const wordToDelete = elKeywordCheckbox.dataset.keyword
        if (elKeywordCheckbox.checked) {
            if (wordToDelete) keywordsToDelete.push(wordToDelete)
        }
        else {
            const newVal = elTr.querySelector('.edit-keyword').value
            const oldVal = elTr.querySelector('.edit-keyword').dataset.keyword
            if (newVal && (!oldVal || newVal !== oldVal) &&
                !keywordsToUpdate.includes(newVal)) keywordsToUpdate.push({ oldVal, newVal })
            // else if (oldVal) keywordsToDelete.push(oldVal)
        }
    })
    updateImgKeywords(imgId, keywordsToUpdate)
    deleteImgKeywords(imgId, keywordsToDelete)
    onUpdateImgKeywordsModal()
}

function onAddKeywordInput() {
    const elFormTBody = document.querySelector('.secondary-modal form .imgs-keywords tbody')
    if (elFormTBody.lastChild.querySelector('.edit-keyword').value) {
        const elTr = document.createElement('tr')
        elTr.innerHTML = `<td>
                <input class="edit-keyword" type="text">
            </td>
            <td>
                <input type="checkbox" class="delete-keyword">
            </td>`
        elFormTBody.appendChild(elTr)
    }
}

function toggleElementsDisplay(elementClass) {
    document.querySelector('.' + elementClass).classList.toggle('shown-modal')
}
function toggleSecondaryModal() {
    toggleElementsDisplay('main-modal')
    toggleElementsDisplay('secondary-modal')
}

function onCloseAll(ev) {
    document.querySelectorAll('.shown-modal').forEach(element => element.classList.remove('shown-modal'))
}


function onDeleteModal(imgId) {
    if (imgId) {
        const img = getImgById(imgId)
        document.querySelector('.modals-container .secondary-modal').innerHTML = `
            <h2>Are you sure?</h2>
            <div class="img-placeholder delete-modal" style="background-image:url(${img.url});"></div>
            <footer class="modal-footer flex">
            <button onclick="onDeleteImg(${imgId})">Yes</button>
            <button onclick="onDeleteModal()">Cancel</button>
            </footer>
            `
    }
    toggleSecondaryModal()
}

function onDeleteImg(imgId) {
    deleteImg(imgId)
    onGalleryInit()
    toggleSecondaryModal()
}

function onUploadimg(ev){
    uploadImg(ev.target.files[0])
}