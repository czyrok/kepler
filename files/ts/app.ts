import * as fs from 'fs'
import { app, protocol, ipcMain, session, BrowserWindow, Menu, shell } from 'electron'
import fetch from 'node-fetch'
import { ElectronBlocker, fullLists } from '@cliqz/adblocker-electron'

const template = [],
    menu = Menu.buildFromTemplate(template),
    gotTheLock = app.requestSingleInstanceLock(),
    defaultSettingFile = '{"lang":"en","se":"google","dimension":{"width":"1400","height":"800"},"dark":{"home":0,"setting":1,"download":1, "radio":1},"radio":{"name":"dancefloor","volume":"50","pin":1}}',
    defaultWindowFile = '{"maximized":0,"pin":0}',
    defaultBookmarkFile = '[]',
    downloadFolderPath = app.getPath('downloads'),
    appDataFolderPath = app.getPath('userData'),
    updateFolderPath = `${appDataFolderPath}\\update\\`,
    updateURL = 'http://update.kepler.czyrok.ovh/',
    thisUpdate = `${app.getName()} Update Setup ${app.getVersion()}.exe`,
    storageFolderPath = `${appDataFolderPath}\\storage\\`,
    settingFilePath = `${storageFolderPath}setting.json`,
    windowFilePath = `${storageFolderPath}window.json`,
    bookmarkFilePath = `${storageFolderPath}bookmark.json`

interface settingFile {
    lang: string
    se: string
}

interface bookmarkFile {
    [index: number]: string
}

interface windowFile {
    maximized: number
    pin: number
}

interface firstFiles {
    [index: number]: [index: number]
}

let firstFiles = [],
    settingFile,
    bookmarkFile,
    windowFile,
    canRecoverValue = 0,

    winDisponibility = 0,
    width,
    height,
    firstTabURL = '',

    win,
    winWait = 0,
    radioIsOpen = 0,
    radioRPCIsOpen = 0,
    currentWindow,
    winRadio,
    winRadioRPC,

    downloadNUM = 0,
    download = [],
    downloadCount = 0,

    setValueInterval,
    createWindowInterval,

    updateDownload = 1,
    updateRetry = 0,
    updateDownloadFinish = 0,
    updatePath

app.allowRendererProcessReuse = true

// app.disableHardwareAcceleration()
Menu.setApplicationMenu(menu)

function mkdirSync(dirPath) {
    try {
        fs.mkdirSync(dirPath)
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}

mkdirSync(storageFolderPath)

function rmdirSync(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            let curPath = path + "/" + file
            if (fs.lstatSync(curPath).isDirectory()) {
                rmdirSync(curPath)
            } else {
                fs.unlinkSync(curPath)
            }
        })
        fs.rmdirSync(path)
    }
}

function isValidJSON(txt) {
    try {
        JSON.parse(txt)
        return true
    } catch {
        return false
    }
}

function transform(byte) {
    if (byte <= 1000) return [byte.toFixed(1), 'o']

    let kilobit = byte / 1000

    if (kilobit < 1000) return [kilobit.toFixed(1), 'Ko']

    let megabit = kilobit / 1000

    if (megabit < 1000) return [megabit.toFixed(1), 'Mo']

    let gigabit = megabit / 1000

    return [gigabit.toFixed(1), 'Go']
}

async function setBlocker(keplerSession, privateSession) {
    const blocker = await ElectronBlocker.fromLists(
        fetch,
        fullLists
    )

    blocker.enableBlockingInSession(keplerSession)
    blocker.enableBlockingInSession(privateSession)
}

function addDownload(e, item, update) {
    downloadCount++

    BrowserWindow.getAllWindows().forEach(e => e.webContents.send('pellet-visible'))

    const currentDownloadNUM = downloadNUM

    item.on('updated', (e, state) => {
        if (state === 'interrupted') {
            BrowserWindow.getAllWindows().forEach(e => e.webContents.send('download', ['reload', currentDownloadNUM]))

            download[currentDownloadNUM].splice(0, 1, 'reload')
        } else if (state === 'progressing') {
            if (item.isPaused()) {
                BrowserWindow.getAllWindows().forEach(e => e.webContents.send('download', ['pause', currentDownloadNUM]))

                download[currentDownloadNUM].splice(0, 1, 'pause')
            } else {
                let percent: number = (item.getReceivedBytes() / item.getTotalBytes()) * 100

                if (percent != 100) {
                    percent = Math.round(percent)
                }

                let speed = item.getReceivedBytes() / ((new Date().getTime() - new Date(item.getStartTime() * 1000).getTime()) / 1000)

                BrowserWindow.getAllWindows().forEach(e => e.webContents.send('download', ['progress', currentDownloadNUM, `${percent}`, `${transform(speed)[0]}${transform(speed)[1]}/s`]))

                download[currentDownloadNUM].splice(0, 1, 'progress')
                download[currentDownloadNUM].splice(6, 1, `${percent}`)
                download[currentDownloadNUM].splice(7, 1, `${transform(speed)[0]}${transform(speed)[1]}/s`)
            }
        }
    })

    item.once('done', (e, state) => {
        if (state === 'completed') {
            BrowserWindow.getAllWindows().forEach(e => e.webContents.send('download', ['succes', currentDownloadNUM, item.getSavePath()]))

            download[currentDownloadNUM].splice(0, 1, 'success')
            download[currentDownloadNUM].splice(5, 1, item.getSavePath())
        } else {
            BrowserWindow.getAllWindows().forEach(e => e.webContents.send('download', ['failure', currentDownloadNUM]))

            download[currentDownloadNUM].splice(0, 1, 'failure')
        }

        downloadCount = downloadCount - 1

        if (downloadCount == 0) BrowserWindow.getAllWindows().forEach(e => e.webContents.send('pellet-hidden'))
    })

    ipcMain.on(`d${downloadNUM}`, (e, arg) => {
        if (arg == 'pause') {
            item.pause()
        } else if (arg == 'resume' && item.canResume()) {
            if (item.canResume()) {
                item.resume()
            } else {
                BrowserWindow.getAllWindows().forEach(e => e.webContents.send('download', ['failure', currentDownloadNUM]))
            }
        } else if (arg == 'cancel') {
            item.cancel()
        }
    })

    if (update === true) {
        download.push(['progress', downloadNUM, item.getFilename(), item.getURL(), item.getTotalBytes(), '', 0, 0, 1])
        BrowserWindow.getAllWindows().forEach(e => e.webContents.send('download', ['update', downloadNUM, item.getFilename(), item.getURL(), item.getTotalBytes()]))
    } else {
        download.push(['progress', downloadNUM, item.getFilename(), item.getURL(), item.getTotalBytes(), '', 0, 0, 0])
        BrowserWindow.getAllWindows().forEach(e => e.webContents.send('download', ['add', downloadNUM, item.getFilename(), item.getURL(), item.getTotalBytes()]))
    }

    downloadNUM++
}

async function quit() {
    if (updateDownload == 0) {
        if (updateDownloadFinish == 1) {
            launchUpdate()
        } else {
            await saveFiles()
            app.quit()
        }
    } else {
        await saveFiles()
        app.quit()
    }
}

async function launchUpdate() {
    await saveFiles()
    await shell.openPath(updatePath)
    app.quit()
}

async function saveFiles() {
    mkdirSync(storageFolderPath)

    if (firstFiles[0] != settingFile) {
        fs.writeFile(settingFilePath, JSON.stringify(settingFile), function (err) { })
    }

    if (firstFiles[1] != bookmarkFile) {
        fs.writeFile(bookmarkFilePath, JSON.stringify(bookmarkFile), function (err) { })
    }

    if (firstFiles[2] != windowFile) {
        fs.writeFile(windowFilePath, JSON.stringify(windowFile), function (err) { })
    }
}

function getValues() {
    firstFiles = []

    fs.readFile(settingFilePath, function (err, settingFileValues) {
        if (settingFileValues === undefined) fs.writeFile(settingFilePath, defaultSettingFile, function (err) { })

        settingFile = settingFileValues

        if (isValidJSON(settingFile) === true) {
            settingFile = JSON.parse(settingFile)
            firstFiles.push(settingFile)
        } else {
            return getValues()
        }

        fs.readFile(bookmarkFilePath, function (err, bookmarkFileValue) {
            if (bookmarkFileValue === undefined) fs.writeFile(bookmarkFilePath, defaultBookmarkFile, function (err) { })

            bookmarkFile = bookmarkFileValue

            if (isValidJSON(bookmarkFile) === true) {
                bookmarkFile = JSON.parse(bookmarkFile)
                firstFiles.push(bookmarkFile)
            } else {
                return getValues()
            }

            fs.readFile(windowFilePath, function (err, windowFileValues) {
                if (windowFileValues === undefined) fs.writeFile(windowFilePath, defaultWindowFile, function (err) { })

                windowFile = windowFileValues

                if (isValidJSON(windowFile) === true) {
                    windowFile = JSON.parse(windowFile)
                    firstFiles.push(windowFile)
                } else {
                    return getValues()
                }

                canRecoverValue = 1
            })
        })
    })
}

getValues()

function setValue() {
    if (canRecoverValue == 1) {
        clearInterval(setValueInterval)

        if (settingFile['dimension']['width'] === undefined || settingFile['dimension']['width'] == '') {
            width = 1400
        } else {
            width = Math.round(settingFile['dimension']['width'])
        }

        if (settingFile['dimension']['height'] === undefined || settingFile['dimension']['height'] == '') {
            height = 800
        } else {
            height = Math.round(settingFile['dimension']['height'])
        }

        winDisponibility = 1
    }
}

function createIntervalWindow(url) {
    if (winWait == 0) {
        firstTabURL = url

        createWindowInterval = setInterval(createWindow, 200)
        setValueInterval = setInterval(setValue, 50)

        winWait = 1
    }
}

function createWindow() {
    if (winDisponibility == 1) {
        clearInterval(createWindowInterval)

        win = new BrowserWindow({
            show: false,
            title: 'Kepler',
            icon: 'files/img/icon/app/icon.ico',
            minWidth: 630,
            minHeight: 350,
            width: width,
            height: height,
            frame: false,
            webPreferences: {
                // preload: path.join(__dirname, 'preload.js'),
                enableRemoteModule: true,
                nodeIntegration: true,
                nodeIntegrationInSubFrames: true,
                webviewTag: true,
                partition: 'persist:kepler'
            }
        })

        // electron.nativeTheme.themeSource = 'dark'

        // win.webContents.openDevTools()
        win.loadFile('files/html/index.html')
        win.once('ready-to-show', () => {
            win.show()
            win.focus()
            win.webContents.send('win-radio', radioIsOpen)

            if (downloadCount > 0) win.webContents.send('pellet-visible')

            winDisponibility = 0
            winWait = 0

            const updateSession = session.fromPartition('update')

            updateSession.downloadURL(updateURL)
        })

        win.once('closed', () => {
            if (currentWindow == win) currentWindow = null
        })
    }
}

function openWinRadio() {
    if (radioIsOpen == 0) {
        winRadio = new BrowserWindow({
            show: false,
            title: 'Kepler Radio',
            icon: 'files/img/icon/app/icon.ico',
            minWidth: 400,
            minHeight: 200,
            width: 400,
            height: 200,
            frame: false,
            maximizable: false,
            webPreferences: {
                enableRemoteModule: true,
                nodeIntegration: true,
                partition: 'persist:kepler'
            }
        })

        // winRadio.webContents.openDevTools()
        winRadio.loadFile('files/html/radio/index.html')
        winRadio.once('ready-to-show', () => {
            winRadio.show()
            winRadio.focus()

            if (downloadCount > 0) winRadio.webContents.send('pellet-visible')

            radioIsOpen = 1

            BrowserWindow.getAllWindows().forEach(e => e.webContents.send('win-radio', radioIsOpen))
        })

        winRadio.once('closed', () => {
            radioIsOpen = 0

            if (radioRPCIsOpen == 1) {
                winRadioRPC.close()

                radioRPCIsOpen = 0
            }

            BrowserWindow.getAllWindows().forEach(e => e.webContents.send('win-radio', radioIsOpen))
        })
    }
}

function openWinRadioRPC() {
    if (radioRPCIsOpen == 0) {
        winRadioRPC = new BrowserWindow({
            title: 'Kepler Radio RPC',
            frame: false,
            resizable: false,
            focusable: false,
            skipTaskbar: true,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                webviewTag: true
            }
        })

        winRadioRPC.loadFile('files/html/radio/rpc.html')

        radioRPCIsOpen = 1
    }
}

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (e, commandLine) => {
        if (commandLine[2] !== undefined) {
            if (currentWindow === undefined || currentWindow === null) {
                createIntervalWindow(commandLine[2])
            } else {
                currentWindow.webContents.send('tab-end', commandLine[2])
            }
        } else {
            createIntervalWindow('')
        }
    })

    app.on('ready', () => {
        if (process.argv.length >= 2) {
            createIntervalWindow(process.argv[1])
        } else createIntervalWindow('')

        const keplerSession = session.fromPartition('persist:kepler')
        const privateSession = session.fromPartition('private')
        const updateSession = session.fromPartition('update')

        // privateSession.clearStorageData()

        setBlocker(keplerSession, privateSession)

        keplerSession.on('will-download', (e, item) => {
            addDownload(e, item, false)
        })
        privateSession.on('will-download', (e, item) => {
            addDownload(e, item, false)
        })

        rmdirSync(updateFolderPath)

        updateSession.on('will-download', (e, item) => {
            if (item.getFilename().indexOf('.exe') != -1) {
                item.setSavePath(`${updateFolderPath}${item.getFilename()}`)
                updatePath = `${updateFolderPath}${item.getFilename()}`

                item.on('updated', (e, state) => {
                    if (state === 'interrupted') {
                        if (updateRetry == 5) {
                            item.cancel()
                        } else {
                            item.resume()
                            updateRetry++
                        }
                    }
                })

                item.once('done', (e, state) => {
                    if (state === 'completed') {
                        updateDownloadFinish = 1
                    }

                    updateDownload = 0
                })

                if (thisUpdate == item.getFilename()) {
                    item.cancel()
                } else {
                    addDownload(e, item, true)
                }
            } else {
                updateDownload = 0
            }
        })
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            quit()
        }
    })

    app.on('activate', () => {
        if (win === null) {
            createIntervalWindow('')
        }
    })

    app.on('browser-window-focus', (e, window) => {
        if (radioIsOpen == 1) {
            if (!winRadio.isFocused()) currentWindow = window
        } else {
            currentWindow = window
        }
    })
}

ipcMain.on('win-radio-rpc-value', (e, arg) => {
    if (radioRPCIsOpen == 1) winRadioRPC.webContents.send('win-radio-rpc-value', arg)
})

ipcMain.on('open-win-radio-rpc', (e, arg) => {
    openWinRadioRPC()
})

ipcMain.on('open-win-radio', () => {
    openWinRadio()
})

ipcMain.on('close-win-radio', () => {
    winRadio.close()
})

ipcMain.on('close-win-radio-rpc', () => {
    if (radioRPCIsOpen == 1) {
        winRadioRPC.close()

        radioRPCIsOpen = 0
    }
})

ipcMain.on('bookmark-file', (e) => {
    e.reply('bookmark-file', bookmarkFile)
})

ipcMain.on('new-bookmark-file', (e, arg) => {
    bookmarkFile = arg

    BrowserWindow.getAllWindows().forEach(e => e.webContents.send('bookmark-file', bookmarkFile))
})

ipcMain.on('setting-file', (e) => {
    e.reply('setting-file', settingFile)
})

ipcMain.on('reset-setting-file', () => {
    settingFile = JSON.parse(defaultSettingFile)

    BrowserWindow.getAllWindows().forEach(e => e.webContents.send('setting-file', settingFile))
})

ipcMain.on('new-setting-file', (e, arg) => {
    settingFile = arg

    BrowserWindow.getAllWindows().forEach(e => e.webContents.send('setting-file', settingFile))
})

ipcMain.on('window-file', (e) => {
    e.reply('window-file', windowFile)
})

ipcMain.on('new-window-file', (e, arg) => {
    windowFile = arg
})

ipcMain.on('new-window-with-url', (e, arg) => {
    createIntervalWindow(arg)
})

ipcMain.on('first-tab', (e) => {
    e.reply('first-tab', [firstTabURL, download])
    firstTabURL = ''
})

ipcMain.on('genocide', () => {
    BrowserWindow.getAllWindows().forEach((e) => {
        if (!e.isFocused()) {
            if (e == winRadio) return
            if (e == winRadioRPC) return

            e.close()
        }
    })
})

ipcMain.on('open-file', (e, arg) => {
    if (currentWindow === undefined || currentWindow === null) {
        createIntervalWindow(arg)
    } else {
        currentWindow.webContents.send('tab-end', arg)
    }
})