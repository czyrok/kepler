process.once('document-start', () => {
  window.$ = window.jQuery = require('jquery')
  const { ipcRenderer } = require('electron')
  let progress = 0

  document.addEventListener('drop', (e) => {
    e.preventDefault()
    e.stopPropagation()

    for (const f of e.dataTransfer.files) {
      ipcRenderer.sendToHost(f.path)
    }
  })

  document.addEventListener('dragover', (e) => {
    e.preventDefault()
    e.stopPropagation()
  })

  document.onreadystatechange = function () {
    if (document.readyState == 'interactive') {
      allElement = $('*')
      length = allElement.length

      for (let i = 0; i < length; i++) {
        percent = 100 / length

        if ($(allElement[i]).length == 1) {
          ipcRenderer.sendToHost(`${progress}%`)

          progress = progress + percent
        }
      }
    }
  }

  $('document').ready(function () {
    $('#setting').click(function () {
      ipcRenderer.sendToHost('open-setting')
    })
  })

  $(window).keydown(function (e) {
    if (e.shiftKey) ipcRenderer.sendToHost('shift')
    if (e.ctrlKey) ipcRenderer.sendToHost('ctrl')
    if (e.which == 78 && e.ctrlKey) ipcRenderer.sendToHost('new-window')
    if (e.which == 84 && !e.shiftKey && e.ctrlKey) ipcRenderer.sendToHost('new-tab')
    if (e.which == 84 && e.shiftKey && e.ctrlKey) ipcRenderer.sendToHost('new-private-tab')
    if (e.which == 87 && e.ctrlKey) ipcRenderer.sendToHost('close-tab')
    if (e.which == 71 && e.ctrlKey) ipcRenderer.sendToHost('genocide')
    if (e.which == 77 && e.ctrlKey) ipcRenderer.sendToHost('mute-tab')
    if (e.which == 70 && e.ctrlKey) ipcRenderer.sendToHost('tab-in-new-window')
    if (e.which == 73 && e.ctrlKey) ipcRenderer.sendToHost('open-dev-tools')
    if (e.which == 188 && e.ctrlKey) ipcRenderer.sendToHost('open-setting')
    if (e.which == 68 && e.ctrlKey) ipcRenderer.sendToHost('open-download')
    if (e.which == 83 && e.ctrlKey) ipcRenderer.sendToHost('screen-shot')
    if (e.which == 27) e.preventDefault()
    if (e.which == 27) if (document.fullscreenElement) {
      document.webkitExitFullscreen()
    } else {
      ipcRenderer.sendToHost('quit-full-screen')
    }
    if (e.which == 9 && e.ctrlKey) ipcRenderer.sendToHost('open-tab-menu')
    if (e.which == 76 && e.ctrlKey) ipcRenderer.sendToHost('copy-search-bar-link')
    if (e.which == 72 && e.ctrlKey) ipcRenderer.sendToHost('load-default-page')
    if (e.which == 66 && e.ctrlKey) ipcRenderer.sendToHost('add-bookmark')
    if (e.which == 82 && e.ctrlKey) ipcRenderer.sendToHost('open-radio')
  })

  $(window).keyup(function (e) {
    if (e.which == 17) ipcRenderer.sendToHost('reset-ctrl')
    if (e.which == 16) ipcRenderer.sendToHost('reset-shift')

    //if (e.which == 9 && e.ctrlKey) ipcRenderer.sendToHost('tab-change')
    if (!e.ctrlKey) ipcRenderer.sendToHost('quit-tab-menu')
    if (e.key == 'F11') e.preventDefault()
    if (e.key == 'F11') ipcRenderer.sendToHost('fullscreen-function')
    if (e.key == 'F5') ipcRenderer.sendToHost('refresh-webview-without-cache')
    if (e.which == 27) e.preventDefault()
  })

  $(window).click(function () {
    ipcRenderer.sendToHost('clic-contextmenu')
  })

  $(window).contextmenu(function () {
    ipcRenderer.sendToHost('clic-contextmenu')
  })

  ipcRenderer.on('quit-full-screen', (e, arg) => {
    if (document.fullscreenElement) {
      document.webkitExitFullscreen()
    } else if (arg == 'ipc') {
      ipcRenderer.sendToHost('quit-full-screen')
    }
  })

  ipcRenderer.on('quit-full-screen-to-close-tab', (e, arg) => {
    if (document.fullscreenElement) {
      document.webkitExitFullscreen()
    }

    ipcRenderer.sendToHost(arg)
  })
})