if (byID('lp.s.footer')) byID('lp.s.footer').textContent = `${appName} ${appVersion} by ${appAuthor}`

console.log(`[${appName}/${appVersion}]`)

$('button').keyup(function (e) {
  if (e.which == 13) e.preventDefault()
  if (e.which == 32) e.preventDefault()
})

$('a').click(function (e) {
  e.preventDefault()
})

$('#search_bar').keydown(function (e) {
  if (e.which == 13) enter()
})

$('#popup').keydown(function (e) {
  if (e.which == 13) validatedPopup()
})

$(window).click(function () {
  tempSetInvisibilityBookmarkUI()
  tempPopupClose()
})

$(window).contextmenu(function () {
  tempSetInvisibilityBookmarkUI()
  tempPopupClose()
})

function checkNewURL() {
  if (byID(tabID)) {
    if (tabGetElement.getURL().indexOf('https://') != -1 || tabGetElement.getURL().indexOf('http://') != -1) {
      $('#search_bar_input').val(tabGetElement.getURL())
      $('#search_bar_url').val(tabGetElement.getURL())
    } else if (tabGetElement.getURL().indexOf(defaultTabURL) != -1 || tabGetElement.getURL().indexOf(defaultTabURL) != -1) {
      $('#search_bar_input').val('')
      $('#search_bar_url').val('')
    } else {
      $('#search_bar_input').val(tabGetElement.getURL())
      $('#search_bar_url').val(tabGetElement.getURL())
    }
  }
}

function checkURL(url, step) {
  let newURl
  let URLConfig

  step0URL = `https://${url}/`
  step1URL = `http://${url}/`

  if (step === 0) newURL = step0URL
  if (step === 1) newURL = step1URL
  if (step === 2) newURL = url

  URLConfig = {
    timeout: 5e4,
    retries: 1,
    domain: newURL,
  }

  if (url.indexOf(':\\') != -1 || url.indexOf(':/') != -1 && url.indexOf('https://') == -1 && url.indexOf('http://')) {
    tabGetElement.loadURL(newURL)
  } else {
    checkInternetConnected(URLConfig).then(() => {
      tabGetElement.loadURL(newURL)
    }).catch(() => {
      if (step == 0) {
        checkURL(url, 1)
      } else if (step == 1) {
        tabGetElement.loadURL(newURL)
      } else {
        tabGetElement.loadURL(newURL)
      }
    })
  }
}

function enter() {
  if (byID(tabID)) {
    let url = $.trim($('#search_bar_input').val())

    if (url.indexOf('localhost') == 0) {
      tabGetElement.loadURL(url)
    } else if (url.indexOf('.') != -1) {
      if (url.indexOf('https://') == -1 && url.indexOf('http://') == -1 && url.indexOf(':\\') == -1 && url.indexOf(':/') == -1) {
        checkURL(url, 0)
      } else {
        checkURL(url, 2)
      }
    } else {
      if (SELinks[searchEngine]) {
        tabGetElement.loadURL(SELinks[searchEngine]['ls'] + url)
      } else {
        tabGetElement.loadURL(SELinks['g']['ls'] + url)
      }
    }

    if (settingVisibility == 1) setting()
    if (downloadVisibility == 1) download()
    if (byID(tabID)) tabGetElement.focus()
  }
}

function createTab(url, endOfTabList, private) {
  if (createTabWait == 0) {
    if (url !== undefined) tabURL = url

    createTabWait = 1

    let a = document.createElement('webview')
    a.setAttribute('class', 'tab')
    a.setAttribute('id', `tab${tabNUM}`)
    a.setAttribute('preload', '../js/webview/preload.js')
    a.setAttribute('nodeIntegrationInSubFrames', 'true')
    a.setAttribute('useragent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 Edg/86.0.622.69')

    if (private === true) {
      a.setAttribute('partition', 'private')
    } else {
      a.setAttribute('partition', 'persist:kepler')
    }

    let h = document.createElement('label')
    h.setAttribute('class', 'tab_content')
    h.setAttribute('id', `tab${tabNUM}_content`)

    if (private === true) h.setAttribute('private', 'true')

    let i = document.createElement('input')
    i.setAttribute('id', `tab${tabNUM}_input`)
    i.setAttribute('type', 'radio')
    i.setAttribute('name', 'tab')
    i.setAttribute('onclick', `changeTabFocus('tab${tabNUM}')`)

    let j = document.createElement('span')
    j.setAttribute('class', 'checkmark')
    j.setAttribute('id', `tab${tabNUM}_checkmark`)

    let k = document.createElement('button')
    k.setAttribute('class', 'crosssign_tab')
    k.setAttribute('onclick', `closeTab('tab${tabNUM}')`)

    let l = document.createElement('p')
    l.setAttribute('id', `tab${tabNUM}_p`)

    let m = document.createElement('img')
    m.setAttribute('id', `tab${tabNUM}_img`)
    m.setAttribute('src', '../img/icon/refresh_normal.png')
    m.setAttribute('onerror', `replaceFavicon('tab${tabNUM}')`)

    let n = document.createElement('button')
    n.setAttribute('class', 'invisible_tab')
    n.setAttribute('id', `tab${tabNUM}_volume`)
    n.setAttribute('onclick', `muteTab('tab${tabNUM}')`)

    let o = document.createElement('div')
    o.setAttribute('class', 'hidden_progress_bar')
    o.setAttribute('id', `tab${tabNUM}_progress_bar`)

    if (endOfTabList === true) {
      tab_menu.appendChild(h)
    } else if (tabURL === undefined || tabURL == '' || tabURL == '.') {
      tab_menu.appendChild(h)
    } else {
      tab_menu.insertBefore(h, byID(`${tabID}_content`).nextSibling)
    }

    if (tabURL === undefined || tabURL == '' || tabURL == '.') {
      a.setAttribute('src', `home/${homePageMode}.html`)

      l.textContent = appName

      l.setAttribute('title', appName)

      changeTitleWindow(appName)

      if (byID('search_bar_input') && frameVisibilityNeedsToChange == 0 && windowInFullscreen == 0) byID('search_bar_input').focus()
    } else {
      a.setAttribute('src', tabURL)

      l.textContent = tabURL

      l.setAttribute('title', tabURL)

      changeTitleWindow(tabURL)
    }

    tab_location.appendChild(a)
    progress_bar_location.appendChild(o)

    byID(`tab${tabNUM}_content`).appendChild(i)
    byID(`tab${tabNUM}_content`).appendChild(j)
    byID(`tab${tabNUM}_checkmark`).appendChild(k)
    byID(`tab${tabNUM}_checkmark`).appendChild(l)
    byID(`tab${tabNUM}_checkmark`).appendChild(m)
    byID(`tab${tabNUM}_checkmark`).appendChild(n)

    if (byID(tabID)) tabGetElement.send('quit-full-screen')
    if (byID(tabID)) byID(tabID).style.display = 'none'
    if (byID(`${tabID}_progress_bar`)) byID(`${tabID}_progress_bar`).style.display = 'none'

    if (byID(`tab${tabNUM}_input`)) byID(`tab${tabNUM}_input`).checked = true

    if (byID(`tab${tabNUM}`)) webviewHistory.push(`tab${tabNUM}`)

    if (windowInFullscreen == 1) if (byID(`tab${tabNUM}`)) byID(`tab${tabNUM}`).style.height = '100%'
    if (windowInFullscreen == 1) if (byID(`tab${tabNUM}`)) byID(`tab${tabNUM}`).style.width = '100%'
    if (windowInFullscreen == 1) if (byID(`tab${tabNUM}`)) byID(`tab${tabNUM}`).style.left = '0'

    if (settingVisibility == 1) setting()
    if (downloadVisibility == 1) download()

    $('#search_bar_input').val('')
    $('#search_bar_url').val('')

    if (private === true) {
      webview[`tab${tabNUM}`] = { 'ready': 0, 'url': '', 'contextmenu': 0, 'private': true, 'favicon': [], 'retry': 0, 'default': 0, 'news': 1, 'audio': { 'yes': 0, 'no': 0 } }
    } else {
      webview[`tab${tabNUM}`] = { 'ready': 0, 'url': '', 'contextmenu': 0, 'private': false, 'favicon': [], 'retry': 0, 'default': 0, 'news': 1, 'audio': { 'yes': 0, 'no': 0 } }
    }

    if (tabURL === undefined || tabURL == '' || tabURL == '.') webview[`tab${tabNUM}`]['default'] = 1

    tabURL = ''
    tabGetElement = byID(`tab${tabNUM}`)
    tabID = `tab${tabNUM}`
    tabNUM = tabNUM + 1

    AEL(tabID)
    setCTRLTabDisplay(tabID)
  }
}

function AEL(id) {
  setInterval(() => {
    if (byID(id)) {
      if (byID(id).isCurrentlyAudible()) {
        if (webview[id]['audio']['yes'] != 30) webview[id]['audio']['yes']++

        webview[id]['audio']['no'] = 0

        if (!byID(id).isAudioMuted() && webview[id]['audio']['yes'] == 30) {
          if (byID(`${id}_volume`)) byID(`${id}_volume`).setAttribute('class', 'volume_tab')
        }
      } else if (!byID(id).isAudioMuted()) {
        if (webview[id]['audio']['no'] != 30) webview[id]['audio']['no']++

        webview[id]['audio']['yes'] = 0

        if (byID(`${id}_volume`) && webview[id]['audio']['no'] == 30) byID(`${id}_volume`).setAttribute('class', 'invisible_tab')
      }

      if (byID(id).isWaitingForResponse()) {
        if (byID(`${id}_progress_bar`)) byID(`${id}_progress_bar`).setAttribute('class', 'progress_bar')

        if (id == tabID) {
          if (byID('refresh')) byID('refresh').setAttribute('id', 'refresh_crosssign')

          loading = 1
        }

        webview[id]['ready'] = 0
      } else {
        if (byID(`${id}_progress_bar`)) byID(`${id}_progress_bar`).setAttribute('class', 'hidden_progress_bar')

        if (id == tabID) {
          if (byID('refresh_crosssign')) byID('refresh_crosssign').setAttribute('id', 'refresh')

          loading = 0
        }
      }
    }
  }, 100)

  byID(id).addEventListener('did-navigate', (e) => {
    if (e.url != webview[id]['url']) {
      if (firstTab == 0 && webview[id]['default'] == 1) {
        defaultTabURL = e.url.substring(0, e.url.length - 10)

        firstTab = 1
      }

      if (id == tabID) {
        checkNewURL()
        changeTitleWindow(e.url)
      }

      replaceTitle(id, e.url)
      setDefaultIcon(id)

      webview[id]['url'] = e.url
    } else {
      checkNewURL()
    }
  })
  byID(id).addEventListener('close', (e) => {
    closeTab(id)
  })
  byID(id).addEventListener('did-start-loading', (e) => {
    if (webview[id]['news'] == 1) {
      createTabWait = 0

      webview[id]['news'] = 0
    }
  })
  byID(id).addEventListener('dom-ready', () => {
    webview[id]['ready'] = 1

    if (webview[id]['contextmenu'] == 0) {
      if (webview[id]['private'] === true) {
        contextMenu({
          window: byID(id),
          showLookUpSelection: true,
          showSearchWithGoogle: false,
          showCopyImage: true,
          showCopyImageAddress: true,
          showSaveImage: true,
          showSaveImageAs: true,
          showSaveLinkAs: false,
          showInspectElement: true,
          showServices: false,
          labels: {
            cut: appWords[settingFile['lang']]['contextmenu']['cut'],
            copy: appWords[settingFile['lang']]['contextmenu']['copy'],
            paste: appWords[settingFile['lang']]['contextmenu']['paste'],
            saveImage: appWords[settingFile['lang']]['contextmenu']['saveimage'],
            saveImageAs: appWords[settingFile['lang']]['contextmenu']['saveimageas'],
            copyImage: appWords[settingFile['lang']]['contextmenu']['copyimage'],
            copyImageAddress: appWords[settingFile['lang']]['contextmenu']['copyimageadress'],
            copyLink: appWords[settingFile['lang']]['contextmenu']['copylink'],
            inspect: appWords[settingFile['lang']]['contextmenu']['inspect']
          },
          menu: (action, prop) => [
            {
              label: appWords[settingFile['lang']]['contextmenu']['openlinkprivatetab'],
              visible: prop.linkURL,
              click: () => {
                createTab(prop.linkURL, false, true)
              }
            },
            {
              label: appWords[settingFile['lang']]['contextmenu']['openlinktab'],
              visible: prop.linkURL,
              click: () => {
                createTab(prop.linkURL)
              }
            },
            {
              label: appWords[settingFile['lang']]['contextmenu']['openlinkwindow'],
              visible: prop.linkURL,
              click: () => {
                saveValuesForNewWindow(prop.linkURL)
              }
            },
            action.separator(),
            {
              label: appWords[settingFile['lang']]['contextmenu']['openprivatetab'],
              click: () => {
                createTab('', true, true)
              }
            },
            {
              label: appWords[settingFile['lang']]['contextmenu']['opentab'],
              click: () => {
                createTab()
              }
            },
            {
              label: appWords[settingFile['lang']]['contextmenu']['openwindow'],
              click: () => {
                saveValuesForNewWindow()
              }
            },
            action.separator(),
            action.cut(),
            action.copy(),
            action.copyLink(),
            action.copyImage(),
            action.copyImageAddress(),
            action.paste(),
            action.separator(),
            {
              label: appWords[settingFile['lang']]['contextmenu']['openimgprivatetab'],
              visible: prop.mediaType == 'image',
              click: () => {
                createTab(prop.srcURL, false, true)
              }
            },
            {
              label: appWords[settingFile['lang']]['contextmenu']['openimgtab'],
              visible: prop.mediaType == 'image',
              click: () => {
                createTab(prop.srcURL)
              }
            },
            {
              label: appWords[settingFile['lang']]['contextmenu']['openimgwindow'],
              visible: prop.mediaType == 'image',
              click: () => {
                saveValuesForNewWindow(prop.srcURL)
              }
            },
            action.separator(),
            // action.saveImage(),
            // action.saveImageAs(),
            {
              label: appWords[settingFile['lang']]['contextmenu']['saveimage'],
              visible: prop.mediaType == 'image',
              click: () => {
                tabGetElement.downloadURL(prop.srcURL)
              }
            },
            action.separator(),
            {
              role: "zoomIn",
              label: appWords[settingFile['lang']]['contextmenu']['zoomin']
            },
            {
              role: "resetZoom",
              label: appWords[settingFile['lang']]['contextmenu']['resetzoom']
            },
            {
              role: "zoomOut",
              label: appWords[settingFile['lang']]['contextmenu']['zoomout']
            },
            action.separator(),
            {
              label: appWords[settingFile['lang']]['contextmenu']['setting'],
              click: () => {
                setting()
              }
            },
            action.separator(),
            {
              label: appWords[settingFile['lang']]['contextmenu']['screenshot'],
              click: () => {
                screenShot()
              }
            },
            {
              label: appWords[settingFile['lang']]['contextmenu']['addbookmark'],
              click: () => {
                addBookmark(tabGetElement.getTitle(), tabGetElement.getURL(), byID(`${tabID}_img`).src, '', true)
              }
            },
            action.inspect()
          ]
        })
      } else {
        contextMenu({
          window: byID(id),
          showLookUpSelection: true,
          showSearchWithGoogle: false,
          showCopyImage: true,
          showCopyImageAddress: true,
          showSaveImage: true,
          showSaveImageAs: true,
          showSaveLinkAs: false,
          showInspectElement: true,
          showServices: false,
          labels: {
            cut: appWords[settingFile['lang']]['contextmenu']['cut'],
            copy: appWords[settingFile['lang']]['contextmenu']['copy'],
            paste: appWords[settingFile['lang']]['contextmenu']['paste'],
            saveImage: appWords[settingFile['lang']]['contextmenu']['saveimage'],
            saveImageAs: appWords[settingFile['lang']]['contextmenu']['saveimageas'],
            copyImage: appWords[settingFile['lang']]['contextmenu']['copyimage'],
            copyImageAddress: appWords[settingFile['lang']]['contextmenu']['copyimageadress'],
            copyLink: appWords[settingFile['lang']]['contextmenu']['copylink'],
            inspect: appWords[settingFile['lang']]['contextmenu']['inspect']
          },
          menu: (action, prop) => [
            {
              label: appWords[settingFile['lang']]['contextmenu']['openlinktab'],
              visible: prop.linkURL,
              click: () => {
                createTab(prop.linkURL)
              }
            },
            {
              label: appWords[settingFile['lang']]['contextmenu']['openlinkprivatetab'],
              visible: prop.linkURL,
              click: () => {
                createTab(prop.linkURL, false, true)
              }
            },
            {
              label: appWords[settingFile['lang']]['contextmenu']['openlinkwindow'],
              visible: prop.linkURL,
              click: () => {
                saveValuesForNewWindow(prop.linkURL)
              }
            },
            action.separator(),
            {
              label: appWords[settingFile['lang']]['contextmenu']['opentab'],
              click: () => {
                createTab()
              }
            },
            {
              label: appWords[settingFile['lang']]['contextmenu']['openprivatetab'],
              click: () => {
                createTab('', true, true)
              }
            },
            {
              label: appWords[settingFile['lang']]['contextmenu']['openwindow'],
              click: () => {
                saveValuesForNewWindow()
              }
            },
            action.separator(),
            action.cut(),
            action.copy(),
            action.copyLink(),
            action.copyImage(),
            action.copyImageAddress(),
            action.paste(),
            action.separator(),
            {
              label: appWords[settingFile['lang']]['contextmenu']['openimgtab'],
              visible: prop.mediaType == 'image',
              click: () => {
                createTab(prop.srcURL)
              }
            },
            {
              label: appWords[settingFile['lang']]['contextmenu']['openimgprivatetab'],
              visible: prop.mediaType == 'image',
              click: () => {
                createTab(prop.srcURL, false, true)
              }
            },
            {
              label: appWords[settingFile['lang']]['contextmenu']['openimgwindow'],
              visible: prop.mediaType == 'image',
              click: () => {
                saveValuesForNewWindow(prop.srcURL)
              }
            },
            action.separator(),
            // action.saveImage(),
            // action.saveImageAs(),
            {
              label: appWords[settingFile['lang']]['contextmenu']['saveimage'],
              visible: prop.mediaType == 'image',
              click: () => {
                tabGetElement.downloadURL(prop.srcURL)
              }
            },
            action.separator(),
            {
              role: "zoomIn",
              label: appWords[settingFile['lang']]['contextmenu']['zoomin']
            },
            {
              role: "resetZoom",
              label: appWords[settingFile['lang']]['contextmenu']['resetzoom']
            },
            {
              role: "zoomOut",
              label: appWords[settingFile['lang']]['contextmenu']['zoomout']
            },
            action.separator(),
            {
              label: appWords[settingFile['lang']]['contextmenu']['setting'],
              click: () => {
                setting()
              }
            },
            action.separator(),
            {
              label: appWords[settingFile['lang']]['contextmenu']['screenshot'],
              click: () => {
                screenShot()
              }
            },
            {
              label: appWords[settingFile['lang']]['contextmenu']['addbookmark'],
              click: () => {
                addBookmark(tabGetElement.getTitle(), tabGetElement.getURL(), byID(`${tabID}_img`).src, '', true)
              }
            },
            action.inspect()
          ]
        })
      }

      webview[id]['contextmenu'] = 1
    }
  })
  byID(id).addEventListener('page-title-updated', () => {
    if (id == tabID) {
      changeTitleWindow(byID(id).getTitle())
      replaceTitle(id, byID(id).getTitle())
    } else {
      replaceTitle(id, byID(id).getTitle())
    }
  })
  byID(id).addEventListener('page-favicon-updated', (e) => {
    webview[id]['retry'] = 0
    webview[id]['favicon'] = e['favicons']

    if (byID(`ctrl_${id}_img`)) byID(`ctrl_${id}_img`).setAttribute('src', e['favicons'][e['favicons'].length - 1])
    if (byID(`${id}_img`)) byID(`${id}_img`).setAttribute('src', e['favicons'][e['favicons'].length - 1])
  })
  byID(id).addEventListener('did-fail-load', (e) => {
    if (e.errorCode == -105) {
      checkInternetConnected(offLineNavConfig).then(() => {
        redAlert(appWords[langApp]['alert']['404'])
      }).catch(() => {
        yellowAlert(appWords[langApp]['alert']['offline'])
      })

      if (byID(`ctrl_${tabID}_p`)) byID(`ctrl_${tabID}_p`).textContent = e.validatedURL
      if (byID(`${tabID}_p`)) byID(`${tabID}_p`).textContent = e.validatedURL

      if (byID(`ctrl_${tabID}_img`)) byID(`ctrl_${tabID}_img`).setAttribute('src', '../img/icon/refresh_normal.png')
      if (byID(`${tabID}_img`)) byID(`${tabID}_img`).setAttribute('src', '../img/icon/refresh_normal.png')

      changeTitleWindow(e.validatedURL)
    }
  })
  byID(id).addEventListener('new-window', (u) => {
    URLWebviewForNewWindow = u.url

    if (ctrlActive == true && shiftActive == true) {
      if (URLWebviewForNewWindow !== undefined) {
        saveValuesForNewWindow(URLWebviewForNewWindow)
      }
    } else {
      if (webview[id]['private'] === true) {
        createTab(URLWebviewForNewWindow, false, true)
      } else {
        createTab(URLWebviewForNewWindow)
      }
    }
  })
  byID(id).addEventListener('enter-html-full-screen', () => {
    changeFrameVisibility()
  })
  byID(id).addEventListener('leave-html-full-screen', () => {
    changeFrameVisibility()
  })
  byID(id).addEventListener('ipc-message', (e) => {
    if (e.channel == 'reset-ctrl') return ctrlActive = false
    if (e.channel == 'reset-shift') return shiftActive = false
    if (e.channel == 'ctrl') return ctrlActive = true
    if (e.channel == 'shift') return shiftActive = true

    if (e.channel == 'tab-in-new-window') return saveValuesForNewWindow(tabGetElement.getURL())
    if (e.channel == 'clic-contextmenu') {
      tempSetInvisibilityBookmarkUI()
      tempPopupClose()

      return
    }
    if (e.channel == 'close-tab') return closeTab(id)
    if (e.channel == 'fullscreen-function') return fullscreen()
    if (e.channel == 'refresh-webview-without-cache') return refreshWebviewWithoutCache()
    if (e.channel == 'open-tab-menu') {
      if (CTRLTabMenuVisibility == 0) {
        showCTRLTabMenu()

        changeTabNUM = 2
      }

      return changeTabFocusWithCTRLTabMenu()
    }
    if (e.channel == 'quit-tab-menu' && CTRLTabMenuVisibility == 1) {
      ctrlTabRequest = 1

      showCTRLTabMenu()
      if (byID(`ctrl_${changeTabID}_input`).checked === true) changeTabFocus(changeTabID)
    }
    if (e.channel == 'quit-tab-menu') return
    if (e.channel == 'open-dev-tools') if (byID(id)) if (!byID(id).isDevToolsOpened()) {
      byID(id).openDevTools()
    } else byID(id).closeDevTools()
    if (e.channel == 'open-dev-tools') return
    if (e.channel == 'open-setting') return setting()
    if (e.channel == 'open-radio') return launchRadio(1)
    if (e.channel == 'quit-full-screen') if (windowInFullscreen == 1) return fullscreen()
    if (e.channel == 'quit-full-screen') return
    if (e.channel == 'new-window') return saveValuesForNewWindow()
    if (e.channel == 'new-tab') return createTab()
    if (e.channel == 'new-private-tab') return createTab('', true, true)
    if (e.channel == 'copy-search-bar-link') {
      copyText = document.querySelector('#search_bar_url')
      copyText.select()
      document.execCommand('copy')

      if (byID('search_bar_input') && frameVisibilityNeedsToChange == 0 && windowInFullscreen == 0) {
        byID('search_bar_input').focus()
      } else {
        if (byID(tabID)) tabGetElement.focus()
      }

      return
    }
    if (e.channel == 'load-default-page') return home()
    if (e.channel == 'add-bookmark') return addBookmark(tabGetElement.getTitle(), tabGetElement.getURL(), byID(`${tabID}_img`).src, '', true)
    if (e.channel == 'genocide') return ipcRenderer.send('genocide')
    if (e.channel == 'mute-tab') return muteTab(tabID)
    if (e.channel == 'open-download') return download()
    if (e.channel == 'screen-shot') return screenShot()

    if (!byID(e.channel)) {
      if (e.channel.indexOf(':\\') != -1 || e.channel.indexOf(':/') != -1) {
        createTab(e.channel, true)
      } else if (e.channel.indexOf('%') != -1) {
        if (byID(`${id}_progress_bar`)) byID(`${id}_progress_bar`).style.width = e.channel
      }
    } else {
      byID(e.channel).stop()
      byID(e.channel).parentNode.removeChild(byID(e.channel))
      byID(`ctrl_${e.channel}_content`).parentNode.removeChild(byID(`ctrl_${e.channel}_content`))
      byID(`${e.channel}_content`).parentNode.removeChild(byID(`${e.channel}_content`))
      byID(`${e.channel}_progress_bar`).parentNode.removeChild(byID(`${e.channel}_progress_bar`))

      if (windowInFullscreen == 0 && frameVisibilityNeedsToChange == 1) changeFrameVisibility()

      index = webviewHistory.indexOf(e.channel)

      if (index > -1) {
        webviewHistory.splice(index, 1)
      }

      changeTabFocusWhenClose()
    }
  })
}

function screenShot() {
  if (byID(tabID)) {
    tabGetElement.capturePage().then((img) => {
      remote.dialog.showSaveDialog({
        filters: [
          { name: 'Image', extensions: ['png'] }
        ],
        properties: ['openFile']
      }).then((e) => {
        fs.writeFile(e.filePath, img.toPNG(), function (err) {
          return
        })
      })
    })
  }
}

function PDFShot() {
  if (byID(tabID)) {
    tabGetElement.printToPDF({}).then((pdf) => {
      remote.dialog.showSaveDialog({
        filters: [
          { name: 'PDF', extensions: ['pdf'] }
        ],
        properties: ['openFile']
      }).then((e) => {
        fs.writeFile(e.filePath, pdf, function (err) {
          return
        })
      })
    })
  }
}

function saveValuesForNewWindow(url) {
  if (canSendWindowFile == 1) {
    ipcRenderer.send('new-window-file-values', windowFile)

    if (url !== undefined) {
      if (url.indexOf('https://') != -1 || url.indexOf('http://') != -1) {
        ipcRenderer.send('new-window-with-url', url)
      } else if (url.indexOf(defaultTabURL) != -1 || url.indexOf(defaultTabURL) != -1) {
        ipcRenderer.send('new-window-with-url', '')
      } else ipcRenderer.send('new-window-with-url', url)
    } else ipcRenderer.send('new-window-with-url', '')
  }
}

function applyRadioChange(name) {
  if (radioName != name && radioLinks[name]['url']) {
    radioName = name

    if (byID(name)) byID(name).checked = true
  }
}

ipcRenderer.on('first-tab', (e, arg) => {
  createTab(arg[0], true)

  let i = 0

  while (i < arg[1].length) {
    if (arg[1][`${i}`][8] == 1) {
      addDownload(arg[1][`${i}`], true)
    } else {
      addDownload(arg[1][`${i}`])
    }

    i++

    if (i >= arg[1].length) downloadDisponibility = 1
  }

  if (arg[1].length === 0) downloadDisponibility = 1
})

ipcRenderer.on('tab-end', (e, arg) => {
  createTab(arg, true)
  win.focus()
})

ipcRenderer.on('win-radio', (e, arg) => {
  if (radioIsOpen != arg) launchRadio()
})