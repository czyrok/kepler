ipcRenderer.send('setting-file')
ipcRenderer.send('window-file')
ipcRenderer.send('bookmark-file')
ipcRenderer.send('first-tab')

ipcRenderer.on('bookmark-file', (e, arg) => {
  if (JSON.stringify(arg) != JSON.stringify(bookmarkList)) {
    bookmarkList = arg

    refreshBookmark()
  }
})

ipcRenderer.on('setting-file', (e, arg) => {
  if (arg != settingFile) {
    settingFile = arg

    if (settingFileHasBeenSet == 0) {
      settingFileHasBeenSet = 1

      setSettingValues()
    } else {
      reloadSettingValues()
    }
  }
})

function setSettingValues() {
  if (settingFile['dark']['setting'] == 0) changeDarkModeForSettingPage()
  if (settingFile['dark']['setting'] == 1) if (byID('dsp')) byID('dsp').checked = true

  if (settingFile['dark']['download'] == 0) changeDarkModeForDownloadPage()
  if (settingFile['dark']['download'] == 1) if (byID('ddp')) byID('ddp').checked = true

  if (settingFile['dark']['radio'] == 0) changeDarkModeForRadioPage()
  if (settingFile['dark']['radio'] == 1) if (byID('drp')) byID('drp').checked = true

  if (settingFile['dark']['home'] == 1) {
    darkHomePage = settingFile['dark']['home']
    if (byID('dhp')) byID('dhp').checked = true
    homePageMode = 'dark'
  } else {
    homePageMode = 'light'
  }

  searchEngine = settingFile['se']
  if (byID(settingFile['se'])) byID(settingFile['se']).checked = true

  applyLangChange(settingFile['lang'])

  contextMenu({
    window: win,
    showLookUpSelection: true,
    showSearchWithGoogle: false,
    showCopyImage: true,
    showCopyImageAddress: true,
    showSaveImage: true,
    showSaveImageAs: true,
    showSaveLinkAs: false,
    showInspectElement: false,
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
        visible: prop.linkURL.indexOf('/*~~*/link/*~~*/') != -1,
        click: () => {
          createTab(prop.linkURL.substring(prop.linkURL.indexOf('/*~~*/link/*~~*/') + 16), true)
        }
      },
      {
        label: appWords[settingFile['lang']]['contextmenu']['openlinkprivatetab'],
        visible: prop.linkURL.indexOf('/*~~*/link/*~~*/') != -1,
        click: () => {
          createTab(prop.linkURL.substring(prop.linkURL.indexOf('/*~~*/link/*~~*/') + 16), true, true)
        }
      },
      {
        label: appWords[settingFile['lang']]['contextmenu']['openlinkwindow'],
        visible: prop.linkURL.indexOf('/*~~*/link/*~~*/') != -1,
        click: () => {
          saveValuesForNewWindow(prop.linkURL.substring(prop.linkURL.indexOf('/*~~*/link/*~~*/') + 16))
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
      {
        label: appWords[settingFile['lang']]['contextmenu']['modify'],
        visible: prop.linkURL.indexOf('/*~~*/bookmark/*~~*/') != -1,
        click: () => {
          if (prop.linkURL.indexOf('/*~~*/link/*~~*/') != -1) {
            tempPopup(prop.linkURL.substring(prop.linkURL.indexOf('/*~~*/folder/*~~*/') + 18, prop.linkURL.indexOf('/*~~*/id/*~~*/')), prop.linkURL.substring(prop.linkURL.indexOf('/*~~*/id/*~~*/') + 14, prop.linkURL.indexOf('/*~~*/link/*~~*/')))
          } else {
            tempPopup(prop.linkURL.substring(prop.linkURL.indexOf('/*~~*/folder/*~~*/') + 18, prop.linkURL.indexOf('/*~~*/id/*~~*/')), prop.linkURL.substring(prop.linkURL.indexOf('/*~~*/id/*~~*/') + 14))
          }
        }
      },
      {
        label: appWords[settingFile['lang']]['contextmenu']['modifybookmarkui'],
        visible: prop.linkURL.indexOf('/*~~*/ui/*~~*/') != -1,
        click: () => {
          tempSetVisibilityBookmarkUI()
        }
      },
      action.separator(),
      action.cut(),
      action.copy(),
      {
        label: appWords[settingFile['lang']]['contextmenu']['copylink'],
        visible: prop.linkURL.indexOf('/*~~*/link/*~~*/') != -1,
        click: () => {
          $('#copy_link').val(prop.linkURL.substring(prop.linkURL.indexOf('/*~~*/link/*~~*/') + 16))

          copyText = document.querySelector('#copy_link')
          copyText.select()
          document.execCommand('copy')

          if (byID('search_bar_input') && frameVisibilityNeedsToChange == 0 && windowInFullscreen == 0) {
            byID('search_bar_input').focus()
          } else {
            if (byID(tabID)) tabGetElement.focus()
          }
        }
      },
      action.copyImage(),
      action.copyImageAddress(),
      action.paste(),
      {
        label: appWords[settingFile['lang']]['contextmenu']['pastego'],
        visible: prop.isEditable,
        click: () => {
          document.execCommand('paste')
          enter()
        }
      },
      action.separator(),
      {
        label: appWords[settingFile['lang']]['contextmenu']['openimgtab'],
        visible: prop.mediaType == 'image',
        click: () => {
          createTab(prop.srcURL, true)
        }
      },
      {
        label: appWords[settingFile['lang']]['contextmenu']['openimgprivatetab'],
        visible: prop.mediaType == 'image',
        click: () => {
          createTab(prop.srcURL, true, true)
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
          win.webContents.downloadURL(prop.srcURL)
        }
      },
      action.separator(),
      {
        label: appWords[settingFile['lang']]['contextmenu']['setting'],
        click: () => {
          setting()
        }
      }
    ]
  })

  widthLaunchApp = settingFile['dimension']['width']
  $('#width').val(settingFile['dimension']['width'])

  heightLaunchApp = settingFile['dimension']['height']
  $('#height').val(settingFile['dimension']['height'])

  applyRadioChange(settingFile['radio']['name'])

  if (byID('setting_content')) byID('setting_content').style.filter = 'blur(0px)'
  if (byID('touch')) byID('touch').style.animation = 'touch_invisible 0.25s ease forwards'

  setTimeout(() => {
    if (byID('touch')) byID('touch').style.display = 'none'
  }, 250)

  canSendSettingFile = 1
}

function reloadSettingValues() {
  if (settingFile['dark']['home'] != darkHomePage) changeDarkModeForHomePage()
  if (settingFile['dark']['setting'] != darkSettingPage) changeDarkModeForSettingPage()
  if (settingFile['dark']['download'] != darkDownloadPage) changeDarkModeForDownloadPage()
  if (settingFile['dark']['radio'] != darkRadioPage) changeDarkModeForRadioPage()

  if (settingFile['se'] != searchEngine) {
    searchEngine = settingFile['se']
    if (byID(settingFile['se'])) byID(settingFile['se']).checked = true
  }

  if (settingFile['lang'] != langApp) {
    applyLangChange(settingFile['lang'])
  }

  if (settingFile['dimension']['width'] != widthLaunchApp) {
    widthLaunchApp = settingFile['dimension']['width']
    $('#width').val(settingFile['dimension']['width'])
  }

  if (settingFile['dimension']['height'] != heightLaunchApp) {
    heightLaunchApp = settingFile['dimension']['height']
    $('#height').val(settingFile['dimension']['height'])
  }

  if (settingFile['radio']['name'] != radioName) {
    applyRadioChange(settingFile['radio']['name'])
  }
}

ipcRenderer.on('window-file', (e, arg) => {
  windowFile = arg

  if (windowFileHasBeenSet == 0) {
    windowFileHasBeenSet = 1
    setWindowValues()
  }
})

function setWindowValues() {
  if (windowFile['maximized'] == 1) expand()

  if (windowFile['pin'] == 1) pin()

  canSendWindowFile = 1
}

$(window).keydown(function (e) {
  if (e.shiftKey) shiftActive = true
  if (e.ctrlKey) ctrlActive = true

  if (e.which == 188 && e.ctrlKey) setting()
  if (e.which == 68 && e.ctrlKey) download()
  if (e.which == 83 && e.ctrlKey) screenShot()
  if (e.which == 78 && e.ctrlKey) saveValuesForNewWindow()
  if (e.which == 84 && !e.shiftKey && e.ctrlKey) createTab()
  if (e.which == 84 && e.shiftKey && e.ctrlKey) createTab('', true, true)
  if (e.which == 87 && e.ctrlKey) closeTab(tabID)
  if (e.which == 70 && e.ctrlKey) saveValuesForNewWindow(tabGetElement.getURL())
  if (e.which == 71 && e.ctrlKey) ipcRenderer.send('genocide')
  if (e.which == 77 && e.ctrlKey) muteTab(tabID)
  if (e.which == 73 && e.ctrlKey) if (byID(tabID)) if (!tabGetElement.isDevToolsOpened()) {
    tabGetElement.openDevTools()
  } else tabGetElement.closeDevTools()
  if (e.which == 27) e.preventDefault()
  if (e.which == 27 && tabGetElement != '') tabGetElement.send('quit-full-screen', 'ipc')
  if (e.which == 9 && e.ctrlKey) {
    if (CTRLTabMenuVisibility == 0) {
      showCTRLTabMenu()

      changeTabNUM = 2
    }
    changeTabFocusWithCTRLTabMenu()
  }
  if (e.which == 76 && e.ctrlKey) {
    copyText = document.querySelector('#search_bar_url')
    copyText.select()
    document.execCommand('copy')

    if (byID('search_bar_input') && frameVisibilityNeedsToChange == 0 && windowInFullscreen == 0) {
      byID('search_bar_input').focus()
    } else {
      if (byID(tabID)) tabGetElement.focus()
    }
  }
  if (e.which == 72 && e.ctrlKey) home()
  if (e.which == 66 && e.ctrlKey) addBookmark(tabGetElement.getTitle(), tabGetElement.getURL(), byID(`${tabID}_img`).src, '', true)
  if (e.which == 82 && e.ctrlKey) launchRadio(1)
})

$(window).keyup(function (e) {
  if (e.which == 17) ctrlActive = false
  if (e.which == 16) shiftActive = false

  if (!e.ctrlKey && CTRLTabMenuVisibility == 1) {
    ctrlTabRequest = 1

    showCTRLTabMenu()
    if (byID(`ctrl_${changeTabID}_input`).checked === true) changeTabFocus(changeTabID)
  }
  if (e.key == 'F11') e.preventDefault()
  if (e.key == 'F11') fullscreen()
  if (e.key == 'F5') refreshWebviewWithoutCache()
  if (e.which == 27) e.preventDefault()
})