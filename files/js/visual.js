function goBackWebview() {
	if (byID(tabID)) {
		if (tabGetElement.canGoBack() === true) {
			tabGetElement.goBack()

			if (settingVisibility == 1) setting()

			if (downloadVisibility == 1) download()
		}
	}
}

function goForwardWebview() {
	if (byID(tabID)) {
		if (tabGetElement.canGoForward() === true) {
			tabGetElement.goForward()

			if (settingVisibility == 1) setting()

			if (downloadVisibility == 1) download()
		}
	}
}

function refreshStopWebview() {
	if (byID(tabID)) {
		if (loading == 0) {
			if (byID('refresh')) byID('refresh').setAttribute('id', 'refresh_crosssign')

			tabGetElement.reload()

			loading = 1
		} else {
			if (byID('refresh_crosssign')) byID('refresh_crosssign').setAttribute('id', 'refresh')

			tabGetElement.stop()

			loading = 0
		}
	}
}

function refreshWebviewWithoutCache() {
	if (byID(tabID)) {
		if (byID('refresh')) byID('refresh').setAttribute('id', 'refresh_crosssign')

		tabGetElement.reloadIgnoringCache()

		loading = 1

		if (settingVisibility == 1) setting()

		if (downloadVisibility == 1) download()
	}
}

function home() {
	if (byID(tabID)) {
		if (SELinks[searchEngine]) {
			tabGetElement.loadURL(SELinks[searchEngine]['ld'])
		} else {
			tabGetElement.loadURL(SELinks['g']['ld'])
		}

		if (settingVisibility == 1) setting()

		if (downloadVisibility == 1) download()
	}
}

function launchRadio(button) {
	if (radioIsOpen == 0) {
		if (byID('radio_launch')) byID('radio_launch').setAttribute('id', 'radio_launch_active')

		if (button == 1) ipcRenderer.send('open-win-radio')

		radioIsOpen = 1
	} else {
		if (byID('radio_launch_active')) byID('radio_launch_active').setAttribute('id', 'radio_launch')

		if (button == 1) ipcRenderer.send('close-win-radio')

		radioIsOpen = 0
	}
}

function pin() {
	if (alwaysOnTop == 0) {
		if (byID('pin')) byID('pin').setAttribute('id', 'pin_active')

		win.setAlwaysOnTop(true)

		alwaysOnTop = 1
	} else {
		if (byID('pin_active')) byID('pin_active').setAttribute('id', 'pin')

		win.setAlwaysOnTop(false)

		alwaysOnTop = 0
	}
}

function mini() {
	win.minimize()
}

function expand() {
	if (win.isMaximized()) {
		win.unmaximize()

		if (byID('reduce')) byID('reduce').setAttribute('id', 'expand')

		isMaximized = 0
	} else {
		win.maximize()

		if (byID('expand')) byID('expand').setAttribute('id', 'reduce')

		isMaximized = 1
	}
}

function expandKeyArrowUp() {
	if (!win.isMaximized()) {
		win.maximize()
		if (byID('expand')) byID('expand').setAttribute('id', 'reduce')

		isMaximized = 1
	}
}

function expandKeyArrowDown() {
	if (win.isMaximized()) {
		win.unmaximize()
		if (byID('reduce')) byID('reduce').setAttribute('id', 'expand')

		isMaximized = 0
	}
}

function shut() {
	window.close()
}

function setting() {
	if (setSettingVisibility == 1) {
		if (downloadVisibility == 1) download()

		if (settingVisibility == 0) {
			setSettingVisibility = 0

			if (byID('setting')) byID('setting').style.display = 'flex'
			if (byID('setting')) byID('setting').style.animation = 'page_visible 0.5s ease forwards'

			if (byID('setting_button')) byID('setting_button').setAttribute('id', 'setting_button_active')

			setTimeout(() => {
				setSettingVisibility = 1
			}, 500)

			settingVisibility = 1
		} else {
			setSettingVisibility = 0

			if (byID('setting')) byID('setting').style.animation = 'page_invisible 0.5s ease forwards'

			if (byID('setting_button_active')) byID('setting_button_active').setAttribute('id', 'setting_button')

			setTimeout(() => {
				if (byID('setting')) byID('setting').style.display = 'none'

				setSettingVisibility = 1
			}, 500)

			settingVisibility = 0
		}
	}
}

function download() {
	if (setDownloadVisibility == 1) {
		if (byID('download0')) {
			if (settingVisibility == 1) setting()

			if (downloadVisibility == 0) {
				setDownloadVisibility = 0

				if (byID('download')) byID('download').style.display = 'flex'
				if (byID('download')) byID('download').style.animation = 'page_visible 0.5s ease forwards'

				if (byID('download_button')) byID('download_button').setAttribute('id', 'download_button_active')

				setTimeout(() => {
					setDownloadVisibility = 1
				}, 500)

				downloadVisibility = 1
			} else {
				setDownloadVisibility = 0

				if (byID('download')) byID('download').style.animation = 'page_invisible 0.5s ease forwards'

				if (byID('download_button_active')) byID('download_button_active').setAttribute('id', 'download_button')

				setTimeout(() => {
					if (byID('download')) byID('download').style.display = 'none'

					setDownloadVisibility = 1
				}, 500)

				downloadVisibility = 0
			}
		} else {
			blueAlert(appWords[langApp]['alert']['download'])
		}
	}
}

function applyLangChange(lang) {
	if (langApp != lang) {
		if (appWords[lang]) {
			if (byID('search_bar_input')) byID('search_bar_input').setAttribute('placeholder', appWords[lang]['interface']['searchbarinput'])

			if (byID('lp.d.title')) byID('lp.d.title').textContent = appWords[lang]['download']['title']

			if (byID('lp.s.title')) byID('lp.s.title').textContent = appWords[lang]['setting']['title']
			if (byID('lp.s.dl.title')) byID('lp.s.dl.title').textContent = appWords[lang]['setting']['dl']['title']
			if (byID('lp.s.wd.title')) byID('lp.s.wd.title').textContent = appWords[lang]['setting']['wd']['title']
			if (byID('lp.s.wd.nb')) byID('lp.s.wd.nb').textContent = appWords[lang]['setting']['wd']['nb']
			if (byID('lp.s.dse.title')) byID('lp.s.dse.title').textContent = appWords[lang]['setting']['dse']['title']
			if (byID('lp.s.dm.title')) byID('lp.s.dm.title').textContent = appWords[lang]['setting']['dm']['title']
			if (byID('lp.s.dm.hp')) byID('lp.s.dm.hp').textContent = appWords[lang]['setting']['dm']['hp']
			if (byID('lp.s.dm.sp')) byID('lp.s.dm.sp').textContent = appWords[lang]['setting']['dm']['sp']
			if (byID('lp.s.dm.dp')) byID('lp.s.dm.dp').textContent = appWords[lang]['setting']['dm']['dp']
			if (byID('lp.s.dm.rp')) byID('lp.s.dm.rp').textContent = appWords[lang]['setting']['dm']['rp']
			if (byID('lp.s.r.title')) byID('lp.s.r.title').textContent = appWords[lang]['setting']['r']['title']

			if (byID('lp.sc.title')) byID('lp.sc.title').textContent = appWords[lang]['sc']['title']
			if (byID('lp.sc.dsc.title')) byID('lp.sc.dsc.title').textContent = appWords[lang]['sc']['dsc']['title']
			if (byID('lp.sc.dsc.cv')) byID('lp.sc.dsc.cv').textContent = appWords[lang]['sc']['dsc']['cv']
			if (byID('lp.sc.dsc.cd')) byID('lp.sc.dsc.cd').textContent = appWords[lang]['sc']['dsc']['cd']
			if (byID('lp.sc.dsc.cr')) byID('lp.sc.dsc.cr').textContent = appWords[lang]['sc']['dsc']['cr']
			if (byID('lp.sc.dsc.ct')) byID('lp.sc.dsc.ct').textContent = appWords[lang]['sc']['dsc']['ct']
			if (byID('lp.sc.dsc.cst')) byID('lp.sc.dsc.cst').textContent = appWords[lang]['sc']['dsc']['cst']
			if (byID('lp.sc.dsc.cw')) byID('lp.sc.dsc.cw').textContent = appWords[lang]['sc']['dsc']['cw']
			if (byID('lp.sc.dsc.cs')) byID('lp.sc.dsc.cs').textContent = appWords[lang]['sc']['dsc']['cs']
			if (byID('lp.sc.dsc.cl')) byID('lp.sc.dsc.cl').textContent = appWords[lang]['sc']['dsc']['cl']
			if (byID('lp.sc.dsc.ch')) byID('lp.sc.dsc.ch').textContent = appWords[lang]['sc']['dsc']['ch']
			if (byID('lp.sc.dsc.cm')) byID('lp.sc.dsc.cm').textContent = appWords[lang]['sc']['dsc']['cm']
			if (byID('lp.sc.dsc.cta')) byID('lp.sc.dsc.cta').textContent = appWords[lang]['sc']['dsc']['cta']
			if (byID('lp.sc.dsc.cc')) byID('lp.sc.dsc.cc').textContent = appWords[lang]['sc']['dsc']['cc']
			if (byID('lp.sc.dsc.cn')) byID('lp.sc.dsc.cn').textContent = appWords[lang]['sc']['dsc']['cn']
			if (byID('lp.sc.dsc.cg')) byID('lp.sc.dsc.cg').textContent = appWords[lang]['sc']['dsc']['cg']
			if (byID('lp.sc.dsc.cf')) byID('lp.sc.dsc.cf').textContent = appWords[lang]['sc']['dsc']['cf']
			if (byID('lp.sc.dsc.csc')) byID('lp.sc.dsc.csc').textContent = appWords[lang]['sc']['dsc']['csc']
			if (byID('lp.sc.dsc.cb')) byID('lp.sc.dsc.cb').textContent = appWords[lang]['sc']['dsc']['cb']
			if (byID('lp.sc.dsc.ci')) byID('lp.sc.dsc.ci').textContent = appWords[lang]['sc']['dsc']['ci']
			if (byID('lp.sc.dsc.f11')) byID('lp.sc.dsc.f11').textContent = appWords[lang]['sc']['dsc']['f11']
			if (byID('lp.sc.dsc.echap')) byID('lp.sc.dsc.echap').textContent = appWords[lang]['sc']['dsc']['echap']
			if (byID('lp.sc.dsc.f5')) byID('lp.sc.dsc.f5').textContent = appWords[lang]['sc']['dsc']['f5']

			if (byID('lp.f.by')) byID('lp.f.by').textContent = `${appName} ${appVersion} ${appWords[lang]['footer']['by']} ${appAuthor}`

			if (byID('lp.p.n')) byID('lp.p.n').textContent = appWords[lang]['popup']['name']
			if (byID('lp.p.f')) byID('lp.p.f').textContent = appWords[lang]['popup']['folder']

			if (byID(lang)) byID(lang).checked = true

			langApp = lang
		}
	}
}

function changeDarkModeForHomePage() {
	if (byID(tabID)) {
		if (darkHomePage == 0) {
			if (tabGetElement.getURL() == '' || tabGetElement.getURL().indexOf('file:///') != -1 && tabGetElement.getURL().indexOf('light.html') != -1) tabGetElement.loadURL(`${__dirname}/../html/home/dark.html`)

			if (byID('dhp')) byID('dhp').checked = true

			homePageMode = 'dark'
			darkHomePage = 1
		} else {
			if (tabGetElement.getURL() == '' || tabGetElement.getURL().indexOf('file:///') != -1 && tabGetElement.getURL().indexOf('dark.html') != -1) tabGetElement.loadURL(`${__dirname}/../html/home/light.html`)

			if (byID('dhp')) byID('dhp').checked = false

			homePageMode = 'light'
			darkHomePage = 0
		}
	}
}

function changeDarkModeForSettingPage() {
	if (darkSettingPage == 0) {
		$('#setting').removeClass('light').addClass('dark')

		if (byID('dsp')) byID('dsp').checked = true

		darkSettingPage = 1
	} else {
		$('#setting').removeClass('dark').addClass('light')

		if (byID('dsp')) byID('dsp').checked = false

		darkSettingPage = 0
	}
}

function changeDarkModeForDownloadPage() {
	if (darkDownloadPage == 0) {
		$('#download').removeClass('light').addClass('dark')

		if (byID('ddp')) byID('ddp').checked = true

		darkDownloadPage = 1
	} else {
		$('#download').removeClass('dark').addClass('light')

		if (byID('ddp')) byID('ddp').checked = false

		darkDownloadPage = 0
	}
}

function changeDarkModeForRadioPage() {
	if (darkRadioPage == 0) {
		$('#radio').removeClass('light').addClass('dark')

		if (byID('drp')) byID('drp').checked = true

		darkRadioPage = 1
	} else {
		$('#radio').removeClass('dark').addClass('light')

		if (byID('drp')) byID('drp').checked = false

		darkRadioPage = 0
	}
}

function reset() {
	if (byID('reset')) byID('reset').setAttribute('id', 'reset_spin')
	if (byID('reset_spin')) byID('reset_spin').setAttribute('disabled', 'true')

	setTimeout(() => {
		if (byID('reset_spin')) byID('reset_spin').setAttribute('id', 'reset')
		if (byID('reset')) byID('reset').removeAttribute('disabled')
	}, 1000)

	blueAlert(appWords[langApp]['alert']['reset'])
	ipcRenderer.send('reset-setting-file')
}

function zoomInWebview() {
	if (byID(tabID)) {
		tabGetElement.setZoomLevel(tabGetElement.getZoomLevel() + 0.3)
	}
}

function zoomWebview() {
	if (byID(tabID)) {
		tabGetElement.setZoomLevel(0)
	}
}

function zoomOutWebview() {
	if (byID(tabID)) {
		tabGetElement.setZoomLevel(tabGetElement.getZoomLevel() - 0.3)
	}
}

function fullscreen() {
	if (frameVisibilityNeedsToChange == 0) {
		if (windowInFullscreen == 0) {
			document.documentElement.webkitRequestFullscreen()

			if (byID('frame')) byID('frame').style.display = 'none'
			if (byID('bookmark')) byID('bookmark').style.display = 'none'

			if (byID('setting')) byID('setting').style.height = '100%'
			if (byID('setting')) byID('setting').style.top = '0'

			if (byID('download')) byID('download').style.height = '100%'
			if (byID('download')) byID('download').style.top = '0'

			if (byID(tabID)) tabGetElement.style.height = '100%'
			if (byID(tabID)) tabGetElement.style.width = '100%'
			if (byID(tabID)) tabGetElement.style.left = '0'

			windowInFullscreen = 1
		} else {
			document.webkitExitFullscreen()

			if (byID('frame')) byID('frame').style.display = ''
			if (byID('bookmark')) byID('bookmark').style.display = ''

			if (byID('setting')) byID('setting').style.height = ''
			if (byID('setting')) byID('setting').style.top = ''

			if (byID('download')) byID('download').style.height = ''
			if (byID('download')) byID('download').style.top = ''

			if (byID(tabID)) tabGetElement.style.height = ''
			if (byID(tabID)) tabGetElement.style.width = ''
			if (byID(tabID)) tabGetElement.style.left = ''

			windowInFullscreen = 0
		}
	} else {
		if (byID(tabID)) tabGetElement.send('quit-full-screen')
	}
}

function changeFrameVisibility() {
	if (windowInFullscreen == 0) {
		if (frameVisibilityNeedsToChange == 0) {
			if (byID('frame')) byID('frame').style.display = 'none'
			if (byID('bookmark')) byID('bookmark').style.display = 'none'

			if (byID('setting')) byID('setting').style.height = '100%'
			if (byID('setting')) byID('setting').style.top = '0'

			if (byID('download')) byID('download').style.height = '100%'
			if (byID('download')) byID('download').style.top = '0'

			if (byID(tabID)) tabGetElement.style.height = '100%'
			if (byID(tabID)) tabGetElement.style.width = '100%'
			if (byID(tabID)) tabGetElement.style.left = '0'

			frameVisibilityNeedsToChange = 1
		} else {
			if (byID('frame')) byID('frame').style.display = ''
			if (byID('bookmark')) byID('bookmark').style.display = ''

			if (byID('setting')) byID('setting').style.height = ''
			if (byID('setting')) byID('setting').style.top = ''

			if (byID('download')) byID('download').style.height = ''
			if (byID('download')) byID('download').style.top = ''

			if (byID(tabID)) tabGetElement.style.height = ''
			if (byID(tabID)) tabGetElement.style.width = ''
			if (byID(tabID)) tabGetElement.style.left = ''

			frameVisibilityNeedsToChange = 0
		}
	}
}

function showCTRLTabMenu() {
	if (CTRLTabMenuVisibility == 0) {
		if (byID('ctrl_tab_menu')) byID('ctrl_tab_menu').style.display = 'flex'

		CTRLTabMenuVisibility = 1
	} else {
		if (byID('ctrl_tab_menu')) byID('ctrl_tab_menu').style.display = 'none'

		CTRLTabMenuVisibility = 0
	}
}

function changeTabFocusWithCTRLTabMenu() {
	if (CTRLTabMenuVisibility == 0) showCTRLTabMenu()

	if (webviewHistory.length > 1) {
		if (webviewHistory.length - changeTabNUM >= 0) {
			let i = webviewHistory.length - changeTabNUM

			if (byID(`ctrl_${webviewHistory[i]}_input`).checked === false) {
				if (byID(webviewHistory[i])) {
					changeTabID = webviewHistory[i]

					byID(`ctrl_${webviewHistory[i]}_input`).checked = true
				}
			} else {
				changeTabNUM = changeTabNUM + 1

				i = webviewHistory.length - changeTabNUM

				if (webviewHistory[i] != tabID) {
					if (byID(webviewHistory[i])) {
						changeTabID = webviewHistory[i]

						byID(`ctrl_${webviewHistory[i]}_input`).checked = true
					}
				}
			}

			changeTabNUM = changeTabNUM + 1
		} else {
			changeTabNUM = 2

			let i = webviewHistory.length - changeTabNUM

			if (byID(`ctrl_${webviewHistory[i]}_input`).checked === false) {
				if (byID(webviewHistory[i])) {
					changeTabID = webviewHistory[i]

					byID(`ctrl_${webviewHistory[i]}_input`).checked = true
				}
			} else {
				changeTabNUM = changeTabNUM + 1

				i = webviewHistory.length - changeTabNUM

				if (webviewHistory[i] != tabID) {
					if (byID(webviewHistory[i])) {
						changeTabID = webviewHistory[i]

						byID(`ctrl_${webviewHistory[i]}_input`).checked = true
					}
				}
			}

			changeTabNUM = 2
		}
	} else {
		changeTabID = webviewHistory[0]
	}
}

function setCTRLTabDisplay(id) {
	let b = document.createElement('label')
	b.setAttribute('class', 'ctrl_tab_content')
	b.setAttribute('id', `ctrl_${id}_content`)

	let c = document.createElement('input')
	c.setAttribute('id', `ctrl_${id}_input`)
	c.setAttribute('type', 'radio')
	c.setAttribute('name', 'ctrl_tab')
	c.setAttribute('onclick', `ctrlTabRequest = 1;changeTabFocus('${id}')`)

	let d = document.createElement('span')
	d.setAttribute('class', 'checkmark')
	d.setAttribute('id', `ctrl_${id}_checkmark`)

	let e = document.createElement('p')
	e.setAttribute('id', `ctrl_${id}_p`)
	e.setAttribute('title', byID(`${id}_p`).textContent)

	e.textContent = byID(`${id}_p`).textContent

	let f = document.createElement('img')
	f.setAttribute('id', `ctrl_${id}_img`)
	f.setAttribute('src', byID(`${id}_img`).src)
	f.setAttribute('onerror', `replaceFavicon('${id}')`)

	let g = document.createElement('button')
	g.setAttribute('onclick', `ctrlTabRequest = 1;closeTab('${id}')`)

	if (webviewHistory.length > 1) {
		ctrl_tab_menu.insertBefore(b, byID(`ctrl_${webviewHistory[webviewHistory.length - 2]}_content`))
	} else {
		ctrl_tab_menu.appendChild(b)
	}

	byID(`ctrl_${id}_content`).appendChild(c)
	byID(`ctrl_${id}_content`).appendChild(d)
	byID(`ctrl_${id}_checkmark`).appendChild(e)
	byID(`ctrl_${id}_checkmark`).appendChild(f)
	byID(`ctrl_${id}_checkmark`).appendChild(g)

	if (byID(`ctrl_${id}_input`)) byID(`ctrl_${id}_input`).checked = true
}

function changeTabFocus(id) {
	if (createTabWait == 0 && id != tabID) {
		if (windowInFullscreen == 1 && ctrlTabRequest == 1) {
			if (byID('setting')) byID('setting').style.height = '100%'
			if (byID('setting')) byID('setting').style.top = '0'

			if (byID('download')) byID('download').style.height = '100%'
			if (byID('download')) byID('download').style.top = '0'

			if (byID(id)) byID(id).style.height = '100%'
			if (byID(id)) byID(id).style.width = '100%'
			if (byID(id)) byID(id).style.left = '0'

			ctrlTabRequest = 0
		} else {
			if (byID('setting')) byID('setting').style.height = ''
			if (byID('setting')) byID('setting').style.top = ''

			if (byID('download')) byID('download').style.height = ''
			if (byID('download')) byID('download').style.top = ''

			if (byID(id)) byID(id).style.height = ''
			if (byID(id)) byID(id).style.width = ''
			if (byID(id)) byID(id).style.left = ''
		}

		if (byID(tabID)) tabGetElement.send('quit-full-screen')
		if (byID(tabID)) byID(tabID).style.display = 'none'
		if (byID(`${tabID}_progress_bar`)) byID(`${tabID}_progress_bar`).style.display = 'none'

		if (byID(`${id}_progress_bar`)) byID(`${id}_progress_bar`).style.display = 'block'
		if (byID(id)) byID(id).style.display = 'flex'
		if (byID(id)) byID(id).focus()

		if (byID(`ctrl_${id}_input`)) byID(`ctrl_${id}_input`).checked = true
		if (byID(`${id}_input`)) byID(`${id}_input`).checked = true

		index = webviewHistory.indexOf(id)

		if (index > -1) {
			webviewHistory.splice(index, 1)
		}

		if (byID(id)) webviewHistory.push(id)
		if (settingVisibility == 1) setting()
		if (downloadVisibility == 1) download()

		tabGetElement = byID(id)
		tabID = id

		if (tabGetElement.getURL().indexOf(':\\') != -1 || tabGetElement.getURL().indexOf(':/') != -1) {
			changeTitleWindow(tabID, byID(`${tabID}_p`).textContent)
		} else {
			changeTitleWindow(tabID, tabGetElement.getTitle())
		}

		byID(`ctrl_${id}_content`).parentNode.removeChild(byID(`ctrl_${id}_content`))

		setCTRLTabDisplay(id)
	}
}

function changeTabFocusWhenClose() {
	if (!byID(tabID)) {
		if (byID(webviewHistory[webviewHistory.length - 1])) {
			return changeTabFocus(webviewHistory[webviewHistory.length - 1])
		}

		window.close()
	}
}

function closeTab(id) {
	if (webview[id]['ready'] == 0) {
		byID(id).stop()
		byID(id).parentNode.removeChild(byID(id))
		byID(`ctrl_${id}_content`).parentNode.removeChild(byID(`ctrl_${id}_content`))
		byID(`${id}_content`).parentNode.removeChild(byID(`${id}_content`))
		byID(`${id}_progress_bar`).parentNode.removeChild(byID(`${id}_progress_bar`))

		if (windowInFullscreen == 0 && frameVisibilityNeedsToChange == 1) changeFrameVisibility()

		index = webviewHistory.indexOf(id)

		if (index > -1) {
			webviewHistory.splice(index, 1)
		}

		changeTabFocusWhenClose()
	} else {
		tabGetElement.send('quit-full-screen-to-close-tab', id)
	}
}

function muteTab(id) {
	if (byID(id)) {
		if (byID(id).isAudioMuted()) {
			byID(id).setAudioMuted(false)

			if (!byID(id).isCurrentlyAudible()) {
				if (byID(`${id}_volume`)) byID(`${id}_volume`).setAttribute('class', 'invisible_tab')
			} else {
				if (byID(`${id}_volume`)) byID(`${id}_volume`).setAttribute('class', 'volume_tab')
			}
		} else {
			byID(id).setAudioMuted(true)

			if (byID(`${id}_volume`)) byID(`${id}_volume`).setAttribute('class', 'mute_tab')
		}
	}
}

function changeTitleWindow(id, title) {
	if (title == appName || title == '' || title === undefined || $('#tab_menu').find(`#${id}_content`).attr('private') == 'true') {
		win.setTitle(appName)
	} else {
		win.setTitle(`${title} - ${appName}`)
	}
}

function replaceTitle(id, title) {
	if (title !== undefined) {
		if (byID(`ctrl_${id}_p`)) byID(`ctrl_${id}_p`).textContent = title
		if (byID(`${id}_p`)) byID(`${id}_p`).textContent = title

		if (byID(`ctrl_${id}_p`)) byID(`ctrl_${id}_p`).setAttribute('title', title)
		if (byID(`${id}_p`)) byID(`${id}_p`).setAttribute('title', title)
	} else {
		if (byID(`ctrl_${id}_p`)) byID(`ctrl_${id}_p`).textContent = byID(id).getURL()
		if (byID(`${id}_p`)) byID(`${id}_p`).textContent = byID(id).getURL()

		if (byID(`ctrl_${id}_p`)) byID(`ctrl_${id}_p`).setAttribute('title', byID(id).getURL())
		if (byID(`${id}_p`)) byID(`${id}_p`).setAttribute('title', byID(id).getURL())
	}
}

function setDefaultIcon(id) {
	if (byID(`ctrl_${id}_img`)) byID(`ctrl_${id}_img`).setAttribute('src', '../img/icon/refresh_normal.png')
	if (byID(`${id}_img`)) byID(`${id}_img`).setAttribute('src', '../img/icon/refresh_normal.png')
}

function replaceFavicon(id) {
	if (webview[id]['retry'] == 0) {
		if (byID(`ctrl_${id}_img`)) byID(`ctrl_${id}_img`).setAttribute('src', webview[id]['favicon'][0])
		if (byID(`${id}_img`)) byID(`${id}_img`).setAttribute('src', webview[id]['favicon'][0])

		webview[id]['retry']++
	} else {
		setDefaultIcon(id)
	}
}

function setAriaLabel(idElement, ariaLabelText) {
	if (byID(idElement)) byID(idElement).setAttribute('aria-label', ariaLabelText)
}

function removeAriaLabel(idElement) {
	if (byID(idElement)) byID(idElement).removeAttribute('aria-label')
}