function checkWidthHeightSetting() {
  if (widthLaunchApp != $('#width').val() || heightLaunchApp != $('#height').val()) {
    widthLaunchApp = $('#width').val()
    heightLaunchApp = $('#height').val()
  }
}

setInterval(checkWidthHeightSetting, 500)

function sendNewSettingFile() {
  if (canSendSettingFile == 1) {
    if (settingFile['dark']['download'] != darkDownloadPage || settingFile['dark']['radio'] != darkRadioPage || settingFile['lang'] != langApp || settingFile['se'] != searchEngine || settingFile['dimension']['width'] != widthLaunchApp || settingFile['dimension']['height'] != heightLaunchApp || settingFile['dark']['home'] != darkHomePage || settingFile['dark']['setting'] != darkSettingPage || settingFile['radio']['name'] != radioName) {
      settingFile['lang'] = langApp

      settingFile['se'] = searchEngine

      settingFile['dimension']['width'] = widthLaunchApp
      settingFile['dimension']['height'] = heightLaunchApp

      settingFile['dark']['home'] = darkHomePage
      settingFile['dark']['setting'] = darkSettingPage
      settingFile['dark']['download'] = darkDownloadPage
      settingFile['dark']['radio'] = darkRadioPage

      settingFile['radio']['name'] = radioName

      ipcRenderer.send('new-setting-file', settingFile)
    }
  }
}

setInterval(sendNewSettingFile, 500)

function sendNewWindowFile() {
  if (canSendWindowFile == 1) {
    if (windowFile['maximized'] != isMaximized || windowFile['pin'] != alwaysOnTop) {
      windowFile['maximized'] = isMaximized

      windowFile['pin'] = alwaysOnTop

      ipcRenderer.send('new-window-file', windowFile)
    }
  }
}

setInterval(sendNewWindowFile, 500)

function detectIsMaximized() {
  if (win.isMaximized() && isMaximized == 0) {
    if (byID('expand')) byID('expand').setAttribute('id', 'reduce')

    isMaximized = 1
  } else if (!win.isMaximized() && isMaximized == 1) {
    if (byID('reduce')) byID('reduce').setAttribute('id', 'expand')

    isMaximized = 0
  }
}

setInterval(detectIsMaximized, 500)

function checkGoback() {
  if (byID(tabID)) {
    if (tabGetElement.canGoBack() === true) {
      enableButton('back')
    } else {
      disableButton('back')
    }
  } else {
    disableButton('back')
  }
}

setInterval(checkGoback, 500)

function checkGoForward() {
  if (byID(tabID)) {
    if (tabGetElement.canGoForward() === true) {
      enableButton('forward')
    } else {
      disableButton('forward')
    }
  } else {
    disableButton('forward')
  }
}

setInterval(checkGoForward, 500)

function checkIfWindowHaveFocus() {
  if (win.isFocused() === false && windowHaveFocus == 1) {
    shiftActive = false
    ctrlActive = false
    windowHaveFocus = 0

    if (CTRLTabMenuVisibility == 1) showCTRLTabMenu()
  } else if (win.isFocused() === true && windowHaveFocus == 0) windowHaveFocus = 1
}

setInterval(checkIfWindowHaveFocus, 50)