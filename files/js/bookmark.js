function checkBookmark() {
    let i = 0
    let bookmark = []

    while (i < bookmarkPList.length) {
        bookmark.push(bookmarkPList[i]['innerText'])

        i++
    }

    bookmarkList = bookmark

    sendNewBookmarkFile()
}

function refreshBookmark() {
    let i = 0

    while (i < bookmarkDIVList.length) {
        bookmark.removeChild(bookmarkDIVList[i])
    }

    let y = 0
    let folder = []

    while (y < bookmarkList.length) {
        if (bookmarkList[y] == '/*~~*/bookmark/*~~*/') {
            if (folder != []) {
                addBookmark(bookmarkList[y + 1], bookmarkList[y + 2], bookmarkList[y + 3], folder[folder.length - 1])
            } else {
                addBookmark(bookmarkList[y + 1], bookmarkList[y + 2], bookmarkList[y + 3])
            }

            y = y + 4
        } else if (bookmarkList[y] == '/*~~*/folder/*~~*/') {
            let temp = `bookmark_menu${bookmarkMenuNumber}`

            if (folder != []) {
                addFolder(bookmarkList[y + 1], bookmarkList[y + 2], folder[folder.length - 1])
            } else {
                addFolder(bookmarkList[y + 1])
            }

            folder.push(temp)

            y = y + 3
        } else if (bookmarkList[y] == '/*~~*/end/*~~*/') {
            folder.splice(folder.length - 1, 1)

            y++
        }
    }

    canSendBookmarkFile = 1
}

function addBookmark(name, link, faviconLink, id, button) {
    a = document.createElement('div')
    a.setAttribute('class', 'bookmark bookmark_element_next')
    a.setAttribute('id', `bookmark${bookmarkNumber}`)
    a.setAttribute('onclick', `setTimeout(() => {folderTimeoutContinue = false}, 50);goURL(\`${link}\`)`)
    a.setAttribute('title', name)

    w = document.createElement('a')
    w.setAttribute('id', `bookmark${bookmarkNumber}_a`)
    w.setAttribute('href', `/*~~*/ui/*~~*//*~~*/bookmark/*~~*//*~~*/folder/*~~*/false/*~~*/id/*~~*/bookmark${bookmarkNumber}/*~~*/link/*~~*/${link}`)

    b = document.createElement('div')
    b.setAttribute('class', 'bookmark_hover')
    b.setAttribute('id', `bookmark${bookmarkNumber}_hover`)

    c = document.createElement('img')

    if (faviconLink === undefined || faviconLink == '') {
        c.setAttribute('src', '../img/icon/refresh_normal.png')
    } else {
        c.setAttribute('src', faviconLink)
    }

    c.setAttribute('id', `bookmark${bookmarkNumber}_img`)
    c.setAttribute('onerror', `byID('bookmark${bookmarkNumber}_img').setAttribute('src', '../img/icon/refresh_normal.png')`)

    d = document.createElement('p')
    d.setAttribute('class', 'gu-hide')
    d.textContent = '/*~~*/bookmark/*~~*/'

    e = document.createElement('p')
    e.setAttribute('class', 'gu-hide')
    e.setAttribute('id', `bookmark${bookmarkNumber}_name`)
    e.textContent = name

    f = document.createElement('p')
    f.setAttribute('class', 'gu-hide')
    f.setAttribute('id', `bookmark${bookmarkNumber}_link`)
    f.textContent = link

    g = document.createElement('p')
    g.setAttribute('class', 'gu-hide')
    g.textContent = faviconLink

    h = document.createElement('button')
    h.setAttribute('class', 'delete_button')
    h.setAttribute('onclick', `UI('bookmark${bookmarkNumber}')`)

    if (id === undefined || id == '') {
        bookmark.appendChild(a)
    } else {
        byID(id).appendChild(a)
    }

    a.appendChild(w)
    w.appendChild(b)
    w.appendChild(c)
    w.appendChild(d)
    w.appendChild(e)
    w.appendChild(f)
    w.appendChild(g)
    w.appendChild(h)

    bookmarkNumber++

    if (button) checkBookmark()

    if (settingVisibility == 1) setting()

    if (downloadVisibility == 1) download()
}

function addFolder(name, active, id) {
    a = document.createElement('div')
    a.setAttribute('class', 'bookmark_menu_dragula bookmark_element_next')

    w = document.createElement('a')
    w.setAttribute('id', `bookmark_menu_background${bookmarkMenuNumber}_a`)
    w.setAttribute('href', `/*~~*/ui/*~~*//*~~*/bookmark/*~~*//*~~*/folder/*~~*/true/*~~*/id/*~~*/bookmark_menu_background${bookmarkMenuNumber}`)

    b = document.createElement('div')

    if (active == 1 || active === undefined || active == '') {
        b.setAttribute('class', 'bookmark_menu_background')

        active = 1
    } else {
        b.setAttribute('class', 'bookmark_menu_background_invisible')
    }

    b.setAttribute('id', `bookmark_menu_background${bookmarkMenuNumber}`)
    b.setAttribute('onclick', `tempChangeBookmarkMenuVisibility('${bookmarkMenuNumber}')`)
    b.setAttribute('title', name)

    c = document.createElement('button')
    c.setAttribute('class', 'delete_button')
    c.setAttribute('onclick', `UI('bookmark_menu_background${bookmarkMenuNumber}')`)

    d = document.createElement('p')
    d.setAttribute('class', 'gu-hide')
    d.textContent = '/*~~*/folder/*~~*/'

    e = document.createElement('p')
    e.setAttribute('class', 'gu-hide')
    e.setAttribute('id', `bookmark_menu_background${bookmarkMenuNumber}_name`)
    e.textContent = name

    f = document.createElement('p')
    f.setAttribute('class', 'gu-hide')
    f.setAttribute('id', `bookmark_menu_background${bookmarkMenuNumber}_active`)
    f.textContent = active

    g = document.createElement('div')
    g.setAttribute('class', 'bookmark_menu')
    g.setAttribute('id', `bookmark_menu${bookmarkMenuNumber}`)

    h = document.createElement('p')
    h.setAttribute('class', 'gu-hide')
    h.textContent = '/*~~*/end/*~~*/'

    if (id === undefined || id == '') {
        bookmark.appendChild(a)
    } else {
        byID(id).appendChild(a)
    }

    a.appendChild(w)
    w.appendChild(b)
    b.appendChild(c)
    b.appendChild(d)
    b.appendChild(e)
    b.appendChild(f)
    b.appendChild(g)
    b.appendChild(h)

    drake.containers.push(document.querySelector(`#bookmark_menu${bookmarkMenuNumber}`))

    bookmarkMenuNumber++

    if (settingVisibility == 1) setting()

    if (downloadVisibility == 1) download()
}

function tempPopup(folder, id) {
    if (popupTimeoutActive === true && folder == 'false') popupTimeoutContinue = false
    if (popupTimeoutActive === true && folder == 'true') return

    popupTimeoutActive = true
    popupCloseTimeoutContinue = false

    setTimeout(() => {
        if (popupTimeoutContinue === false) {
            popupTimeoutActive = false
            popupTimeoutContinue = true
            popupCloseTimeoutContinue = true
        } else {
            popup(folder, id, name, link)

            popupTimeoutActive = false
            popupTimeoutContinue = true
            popupCloseTimeoutContinue = true
        }
    }, 100)
}

function keepPopupVisibility() {
    setTimeout(() => {
        popupCloseTimeoutContinue = false
    }, 50)
}

function tempPopupClose() {
    if (popupTimeoutActive === true) return
    if (popupCloseTimeoutActive === true) return

    popupCloseTimeoutActive = true

    setTimeout(() => {
        if (popupCloseTimeoutContinue === false) {
            popupCloseTimeoutActive = false
            popupCloseTimeoutContinue = true
        } else {
            if (popupVisible == 1) closePopup()

            popupCloseTimeoutActive = false
            popupCloseTimeoutContinue = true
        }
    }, 100)
}

function popup(folder, id) {
    if (popupVisible == 0) {
        if (folder == 'true' && folderSliderStatus == false || folder == 'false' && folderSliderStatus == true) changeFolderSliderStatus()

        if (byID(`${id}_name`)) {
            $('#name').val(byID(`${id}_name`).textContent)
        } else $('#name').val('')

        if (byID(`${id}_link`)) {
            $('#link').val(byID(`${id}_link`).textContent)
        } else $('#link').val('')

        if (byID('popup')) byID('popup').style.animation = 'popup_visible 0.3s ease forwards'

        if (id !== undefined) {
            if (byID('input_folder')) byID('input_folder').setAttribute('disabled', 'true')
            if (byID('folder')) byID('folder').setAttribute('id', 'folder_disabled')

            if (byID('delete_disabled')) byID('delete_disabled').setAttribute('id', 'delete')
            if (byID('delete')) byID('delete').removeAttribute('disabled')
        } else {
            if (byID('input_folder')) byID('input_folder').removeAttribute('disabled')
            if (byID('folder_disabled')) byID('folder_disabled').setAttribute('id', 'folder')

            if (byID('delete')) byID('delete').setAttribute('id', 'delete_disabled')
            if (byID('delete_disabled')) byID('delete_disabled').setAttribute('disabled', 'true')
        }

        if (folder == 'true') {
            if (byID('link')) byID('link').setAttribute('disabled', 'true')
            if (byID('link')) byID('link').style.cursor = 'not-allowed'
            if (byID('link_div')) byID('link_div').setAttribute('id', 'link_div_disabled')
        } else {
            if (byID('link')) byID('link').removeAttribute('disabled')
            if (byID('link')) byID('link').style.cursor = 'auto'
            if (byID('link_div_disabled')) byID('link_div_disabled').setAttribute('id', 'link_div')

            if (byID(`${id}_hover`)) byID(`${id}_hover`).setAttribute('class', 'bookmark_hover_active')
        }

        setTimeout(() => {
            if (byID('name')) byID('name').focus()
        }, 300)

        popupVisible = 1
        bookmarkItemID = id
    } else {
        if (byID('popup')) byID('popup').style.animation = 'popup_invisible 0.3s ease forwards'

        setTimeout(() => {
            if (folder == 'true' && folderSliderStatus == false || folder == 'false' && folderSliderStatus == true) changeFolderSliderStatus()
            if (byID(`${bookmarkItemID}_hover`)) byID(`${bookmarkItemID}_hover`).setAttribute('class', 'bookmark_hover')

            $('#name').val(name)
            $('#link').val(link)

            if (byID('popup')) byID('popup').style.animation = 'popup_visible 0.3s ease forwards'

            if (id !== undefined) {
                if (byID('input_folder')) byID('input_folder').setAttribute('disabled', 'true')
                if (byID('folder')) byID('folder').setAttribute('id', 'folder_disabled')

                if (byID('delete_disabled')) byID('delete_disabled').setAttribute('id', 'delete')
                if (byID('delete')) byID('delete').removeAttribute('disabled')
            } else {
                if (byID('input_folder')) byID('input_folder').removeAttribute('disabled')
                if (byID('folder_disabled')) byID('folder_disabled').setAttribute('id', 'folder')

                if (byID('delete')) byID('delete').setAttribute('id', 'delete_disabled')
                if (byID('delete_disabled')) byID('delete_disabled').setAttribute('disabled', 'true')
            }

            if (folder == 'true') {
                if (byID('link')) byID('link').setAttribute('disabled', 'true')
                if (byID('link')) byID('link').style.cursor = 'not-allowed'
                if (byID('link_div')) byID('link_div').setAttribute('id', 'link_div_disabled')
            } else {
                if (byID('link')) byID('link').removeAttribute('disabled')
                if (byID('link')) byID('link').style.cursor = 'auto'
                if (byID('link_div_disabled')) byID('link_div_disabled').setAttribute('id', 'link_div')

                if (byID(`${id}_hover`)) byID(`${id}_hover`).setAttribute('class', 'bookmark_hover_active')
            }

            setTimeout(() => {
                if (byID('name')) byID('name').focus()
            }, 300)

            popupVisible = 1
            bookmarkItemID = id
        }, 300)
    }
}

function changeFolderSliderStatus() {
    if (folderSliderStatus == false) {
        if (byID('input_folder')) byID('input_folder').checked = true

        if (byID('link')) byID('link').setAttribute('disabled', 'true')
        if (byID('link')) byID('link').style.cursor = 'not-allowed'
        if (byID('link_div')) byID('link_div').setAttribute('id', 'link_div_disabled')

        folderSliderStatus = true
    } else {
        if (byID('input_folder')) byID('input_folder').checked = false

        if (byID('link')) byID('link').removeAttribute('disabled')
        if (byID('link')) byID('link').style.cursor = 'auto'
        if (byID('link_div_disabled')) byID('link_div_disabled').setAttribute('id', 'link_div')

        folderSliderStatus = false
    }
}

function validatedPopup() {
    if (bookmarkItemID === undefined || bookmarkItemID === '') {
        if (folderSliderStatus) {
            addFolder($('#name').val())
        } else {
            addBookmark($('#name').val(), $('#link').val())
        }
    } else {
        if (byID(bookmarkItemID)) {
            byID(bookmarkItemID).setAttribute('title', $('#name').val())

            if (!folderSliderStatus) byID(bookmarkItemID).setAttribute('onclick', `setTimeout(() => {folderTimeoutContinue = false}, 50);goURL(\`${$('#link').val()}\`)`)
        }
        if (byID(`${bookmarkItemID}_name`)) byID(`${bookmarkItemID}_name`).textContent = $('#name').val()
        if (byID(`${bookmarkItemID}_link`)) byID(`${bookmarkItemID}_link`).textContent = $('#link').val()

        if (!folderSliderStatus) if (byID(`${bookmarkItemID}_a`)) byID(`${bookmarkItemID}_a`).setAttribute('href', `/*~~*/ui/*~~*//*~~*/bookmark/*~~*//*~~*/folder/*~~*/false/*~~*/id/*~~*/${bookmarkItemID}/*~~*/link/*~~*/${$('#link').val()}`)
    }

    if (popupVisible == 1) {
        if (byID('popup')) byID('popup').style.animation = 'popup_invisible 0.3s ease forwards'

        popupVisible = 0
    }

    checkBookmark()
}

function deletePopup() {
    if (bookmarkItemID === undefined || bookmarkItemID === '') {
        closePopup()
    } else {
        $(`#${bookmarkItemID}`).remove()
        checkBookmark()
        closePopup()
    }
}

function closePopup() {
    if (popupVisible == 1) {
        if (byID('popup')) byID('popup').style.animation = 'popup_invisible 0.3s ease forwards'

        if (byID(`${bookmarkItemID}_hover`)) byID(`${bookmarkItemID}_hover`).setAttribute('class', 'bookmark_hover')

        popupVisible = 0
    }
}

function tempChangeBookmarkMenuVisibility(number) {
    if (folderTimeoutActive === true) return

    folderTimeoutActive = true
    folderTimeoutContinue = true

    setTimeout(() => {
        if (folderTimeoutContinue === false) {
            folderTimeoutActive = false
        } else {
            changeBookmarkMenuVisibility(number)

            folderTimeoutActive = false
        }
    }, 100)
}

function changeBookmarkMenuVisibility(number) {
    if (byID(`bookmark_menu_background${number}`)) {
        if (byID(`bookmark_menu_background${number}`).className == 'bookmark_menu_background') {
            byID(`bookmark_menu_background${number}`).setAttribute('class', 'bookmark_menu_background_invisible')

            if (byID(`bookmark_menu_background${number}_active`)) byID(`bookmark_menu_background${number}_active`).textContent = 0
        } else {
            byID(`bookmark_menu_background${number}`).setAttribute('class', 'bookmark_menu_background')

            if (byID(`bookmark_menu_background${number}_active`)) byID(`bookmark_menu_background${number}_active`).textContent = 1
        }

        checkBookmark()
    }
}

function tempSetVisibilityBookmarkUI() {
    if (bookmarkUIInvisibilityTimeoutActive === true) return
    if (bookmarkUIVisibilityTimeoutActive === true) return

    bookmarkUIVisibilityTimeoutActive = true
    bookmarkUIInvisibilityTimeoutContinue = false

    setTimeout(() => {
        if (bookmarkUIVisibilityTimeoutContinue === false) {
            bookmarkUIVisibilityTimeoutActive = false
            bookmarkUIVisibilityTimeoutContinue = true
            bookmarkUIInvisibilityTimeoutContinue = true
        } else {
            setVisibilityBookmarkUI()

            bookmarkUIVisibilityTimeoutActive = false
            bookmarkUIVisibilityTimeoutContinue = true
            bookmarkUIInvisibilityTimeoutContinue = true
        }
    }, 100)
}

function tempSetInvisibilityBookmarkUI() {
    if (bookmarkUIVisibilityTimeoutActive === true) return
    if (bookmarkUIInvisibilityTimeoutActive === true) return

    bookmarkUIInvisibilityTimeoutActive = true
    bookmarkUIVisibilityTimeoutContinue = false

    setTimeout(() => {
        if (bookmarkUIInvisibilityTimeoutContinue === false) {
            bookmarkUIInvisibilityTimeoutActive = false
            bookmarkUIInvisibilityTimeoutContinue = true
            bookmarkUIVisibilityTimeoutContinue = true
        } else {
            setInvisibilityBookmarkUI()

            bookmarkUIInvisibilityTimeoutActive = false
            bookmarkUIInvisibilityTimeoutContinue = true
            bookmarkUIVisibilityTimeoutContinue = true
        }
    }, 100)
}

function UI(id) {
    setTimeout(() => {
        folderTimeoutContinue = false
        goTimeoutContinue = false
    }, 50)

    bookmarkItemID = id

    deletePopup()
    tempSetVisibilityBookmarkUI()
}

function setVisibilityBookmarkUI() {
    if (byID('plus')) byID('plus').style.visibility = 'visible'
    if (byID('plus')) byID('plus').style.animation = 'ui_visible .1s ease forwards'

    Array.prototype.forEach.call(document.getElementsByClassName('delete_button'), function (el) {
        el.style.visibility = 'visible'
        el.style.animation = 'ui_visible .1s ease forwards'
    })
}

function setInvisibilityBookmarkUI() {
    if (byID('plus')) byID('plus').style.animation = 'ui_invisible .1s ease forwards'

    setTimeout(() => {
        if (byID('plus')) byID('plus').style.visibility = 'hidden'
    }, 100)

    Array.prototype.forEach.call(document.getElementsByClassName('delete_button'), function (el) {
        el.style.animation = 'ui_invisible .1s ease forwards'

        setTimeout(() => {
            el.style.visibility = 'hidden'
        }, 100)
    })
}

function sendNewBookmarkFile() {
    if (canSendBookmarkFile == 1) {
        ipcRenderer.send('new-bookmark-file', bookmarkList)
    }
}

function goURL(url) {
    if (goTimeoutActive === true) return

    goTimeoutActive = true
    goTimeoutContinue = true

    setTimeout(() => {
        if (goTimeoutContinue === false) {
            goTimeoutActive = false
        } else {
            if (byID(tabID)) {
                if (ctrlActive == true && shiftActive == true) {
                    saveValuesForNewWindow(url)
                } else if (ctrlActive == true && shiftActive == false) {
                    createTab(url)
                } else {
                    tabGetElement.loadURL(url)

                    if (byID(tabID)) tabGetElement.focus()
                }
            }

            goTimeoutActive = false
        }
    }, 100)
}