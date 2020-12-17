document.addEventListener('wheel', (e) => {
  if (settingVisibility == 0) {
    if (e.deltaY < 0) {
      changeVolumeToUp()
    } else {
      changeVolumeToDown()
    }
  }
})

$(window).keydown(function (e) {
  if (e.which == 188 && e.ctrlKey) setting()
  if (e.which == 68 && e.ctrlKey) download()
  if (e.which == 78 && e.ctrlKey) ipcRenderer.send('new-window-with-url', '')
  if (e.which == 71 && e.ctrlKey) ipcRenderer.send('genocide')
})

$(window).keyup(function (e) {
  if (e.which == 32) playPauseRadio()
})

if (radioLinks[radioName]) {
  applyRadioChange(radioName)
} else {
  applyRadioChange('dancefloor')
}

function applyRadioChange(name) {
  if (radioName != name && radioLinks[name]['url']) {
    radio.src = radioLinks[name]['url']
    radioName = name

    recoverRadioValue()

    if (byID(name)) byID(name).checked = true
  }
}

function playPauseRadio() {
  if (radioPlayPause == 0) {
    if (byID('play')) byID('play').setAttribute('id', 'pause')

    $('#radio').addClass('play')

    checkInternetConnected(offLineNavConfig).then().catch(() => {
      if (radioPlayPause == 1) playPauseRadio()

      yellowAlert(appWords[langApp]['alert']['offline'])
    })

    ipcRenderer.send('open-win-radio-rpc')
    radio.load()
    radio.play()

    radioPlayPause = 1
  } else {
    if (byID('pause')) byID('pause').setAttribute('id', 'play')

    $('#radio').removeClass('play')

    ipcRenderer.send('close-win-radio-rpc')
    radio.pause()

    radioPlayPause = 0
  }
}

function detectPauseRadio() {
  if (radio.paused) {
    if (radioPlayPause == 1) {
      if (byID('pause')) byID('pause').setAttribute('id', 'play')

      $('#radio').removeClass('play')

      ipcRenderer.send('close-win-radio-rpc')

      radioPlayPause = 0
    }
  }
  if (!radio.paused) {
    if (radioPlayPause == 0) {
      if (byID('play')) byID('play').setAttribute('id', 'pause')

      $('#radio').addClass('play')

      checkInternetConnected(offLineNavConfig).catch(() => {
        if (radioPlayPause == 1) playPauseRadio()

        yellowAlert(appWords[langApp]['alert']['offline'])
      })

      ipcRenderer.send('open-win-radio-rpc')
      radio.load()
      radio.play()

      radioPlayPause = 1
    }
  }
}

setInterval(detectPauseRadio, 500)

function recoverRadioValue() {
  $.ajax({
    cache: 'false',
    method: 'POST',
    url: radioLinks[radioName]['xml'],
    dataType: 'xml',
    success: function (xml, textStatus, XMLHttpRequest) {
      musicName = $(xml).find('morceau:eq(0)').find('chanson').text()
      musicArtist = $(xml).find('morceau:eq(0)').find('chanteur').text()
      musicCover = $(xml).find('morceau:eq(0)').find('pochette').text()

      nextMusicArtist = $(xml).find('morceau:eq(0)').find('artistnext').text()
      nextMusicName = $(xml).find('morceau:eq(0)').find('titlenext').text()

      if (musicName !== undefined && musicName != '' && musicName != 'La musique revient vite...' && musicArtist !== undefined && musicArtist != '') {
        if (radioPlayPause == 1) ipcRenderer.send('win-radio-rpc-value', [musicName, musicArtist])

        if (byID('music_name')) {
          byID('music_name').textContent = musicName

          byID('music_name').setAttribute('title', musicName)
        }

        if (byID('music_artist')) {
          byID('music_artist').textContent = musicArtist

          byID('music_artist').setAttribute('title', musicArtist)
        }

        if (byID('music_cover')) byID('music_cover').setAttribute('src', musicCover)
      }
    }
  })
}

setInterval(() => {
  checkInternetConnected(offLineNavConfig).then(() => {
    recoverRadioValue()
  })
}, 10e3)

function changeVolumeToUp() {
  sliderInputValue = Math.round($('#slider_input').val()) + 10

  let volumeValue

  if (sliderInputValue < 100) {
    volumeValue = `0.${sliderInputValue}`
  } else {
    volumeValue = 1
    sliderInputValue = 100
  }

  $('#slider_input').val(sliderInputValue)
  radioVolume = $('#slider_input').val()

  radio.volume = volumeValue
}

function changeVolumeToDown() {
  let sliderInputValue = Math.round($('#slider_input').val()) - 10
  let volumeValue

  if (sliderInputValue >= 10) {
    volumeValue = `0.${sliderInputValue}`
  } else if (sliderInputValue < 10 && sliderInputValue > 0) {
    volumeValue = `0.0${sliderInputValue}`
  } else if (sliderInputValue <= 0) {
    volumeValue = 0
    sliderInputValue = 0
  }

  $('#slider_input').val(sliderInputValue)
  radioVolume = $('#slider_input').val()

  radio.volume = volumeValue
}

function changeVolume() {
  if (radioVolume !== $('#slider_input').val()) {
    if ($('#slider_input').val() != 100) {
      if ($('#slider_input').val() >= 10) {
        radioVolume = $('#slider_input').val()
        let volumeValue = `0.${$('#slider_input').val()}`
        radio.volume = volumeValue
      } else if ($('#slider_input').val() < 10) {
        radioVolume = $('#slider_input').val()
        let volumeValue = `0.0${$('#slider_input').val()}`
        radio.volume = volumeValue
      } else if ($('#slider_input').val() == 0) {
        radioVolume = $('#slider_input').val()
        radio.volume = 0
      }
    } else {
      radioVolume = $('#slider_input').val()
      radio.volume = 1
    }
  }
}

setInterval(changeVolume, 500)

ipcRenderer.send('setting-file')

ipcRenderer.on('setting-file', (event, arg) => {
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

function reloadSettingValues() {
  if (settingFile['dark']['setting'] != darkSettingPage) changeDarkModeForSettingPage()
  if (settingFile['dark']['download'] != darkDownloadPage) changeDarkModeForDownloadPage()
  if (settingFile['dark']['radio'] != darkRadioPage) changeDarkModeForRadioPage()

  if (settingFile['lang'] != langApp) {
    applyLangChange(settingFile['lang'])
  }

  if (settingFile['radio']['name'] != radioName) {
    applyRadioChange(settingFile['radio']['name'])
    recoverRadioValue()
  }
}

function setSettingValues() {
  if (settingFile['dark']['setting'] == 0) changeDarkModeForSettingPage()
  if (settingFile['dark']['setting'] == 1) if (byID('dsp')) byID('dsp').checked = true

  if (settingFile['dark']['download'] == 0) changeDarkModeForDownloadPage()
  if (settingFile['dark']['download'] == 1) if (byID('ddp')) byID('ddp').checked = true

  if (settingFile['dark']['radio'] == 0) changeDarkModeForRadioPage()
  if (settingFile['dark']['radio'] == 1) if (byID('drp')) byID('drp').checked = true

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
        label: appWords[settingFile['lang']]['contextmenu']['openwindow'],
        click: () => {
          ipcRenderer.send('new-window-with-url', '')
        }
      },
      action.separator(),
      action.cut(),
      action.copy(),
      action.copyImage(),
      action.copyImageAddress(),
      action.paste(),
      action.separator(),
      {
        label: appWords[settingFile['lang']]['contextmenu']['openimg'],
        visible: prop.mediaType == 'image',
        click: () => {
          ipcRenderer.send('open-file', prop.srcURL)
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

  applyRadioChange(settingFile['radio']['name'])
  recoverRadioValue()

  if (settingFile['radio']['pin'] == 1) pin()

  let sliderInputValueConfig = settingFile['radio']['volume']
  let sliderInputValue = sliderInputValueConfig
  let volumeValue
  if (sliderInputValue >= 10 && sliderInputValueConfig < 100) {
    volumeValue = `0.${sliderInputValue}`
  } else if (sliderInputValue < 10 && sliderInputValue > 0) {
    volumeValue = `0.0${sliderInputValue}`
  } else if (sliderInputValue <= 0) {
    volumeValue = 0
    sliderInputValue = 0
  } else {
    volumeValue = 1
    sliderInputValue = 100
  }
  $('#slider_input').val(sliderInputValue)
  radio.volume = volumeValue

  if (byID('setting_content')) byID('setting_content').style.filter = 'blur(0px)'
  if (byID('touch')) byID('touch').style.animation = 'touch_invisible 0.25s ease forwards'

  setTimeout(() => {
    if (byID('touch')) byID('touch').style.display = 'none'
  }, 250)

  canSendSettingFile = 1
}

function sendNewSettingFile() {
  if (canSendSettingFile == 1) {
    if (settingFile['dark']['download'] != darkDownloadPage || settingFile['radio']['pin'] != alwaysOnTop || settingFile['dark']['radio'] != darkRadioPage || settingFile['radio']['volume'] != $('#slider_input').val() || settingFile['lang'] != langApp || settingFile['dark']['setting'] != darkSettingPage || settingFile['radio']['name'] != radioName) {
      settingFile['radio']['volume'] = $('#slider_input').val()

      settingFile['lang'] = langApp

      settingFile['dark']['setting'] = darkSettingPage
      settingFile['dark']['download'] = darkDownloadPage
      settingFile['dark']['radio'] = darkRadioPage

      settingFile['radio']['name'] = radioName

      settingFile['radio']['pin'] = alwaysOnTop

      ipcRenderer.send('new-setting-file', settingFile)
    }
  }
}

setInterval(sendNewSettingFile, 500)

ipcRenderer.send('first-tab')

ipcRenderer.on('first-tab', (e, arg) => {
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