"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var electron_1 = require("electron");
var node_fetch_1 = require("node-fetch");
var adblocker_electron_1 = require("@cliqz/adblocker-electron");
var template = [], menu = electron_1.Menu.buildFromTemplate(template), gotTheLock = electron_1.app.requestSingleInstanceLock(), defaultSettingFile = '{"lang":"en","se":"google","dimension":{"width":"1400","height":"800"},"dark":{"home":0,"setting":1,"download":1, "radio":1},"radio":{"name":"dancefloor","volume":"50","pin":1}}', defaultWindowFile = '{"maximized":0,"pin":0}', defaultBookmarkFile = '[]', downloadFolderPath = electron_1.app.getPath('downloads'), appDataFolderPath = electron_1.app.getPath('userData'), updateFolderPath = appDataFolderPath + "\\update\\", updateURL = 'http://update.kepler.czyrok.ovh/', thisUpdate = electron_1.app.getName() + " Update Setup " + electron_1.app.getVersion() + ".exe", storageFolderPath = appDataFolderPath + "\\storage\\", settingFilePath = storageFolderPath + "setting.json", windowFilePath = storageFolderPath + "window.json", bookmarkFilePath = storageFolderPath + "bookmark.json";
var firstFiles = [], settingFile, bookmarkFile, windowFile, canRecoverValue = 0, winDisponibility = 0, width, height, firstTabURL = '', win, winWait = 0, radioIsOpen = 0, radioRPCIsOpen = 0, currentWindow, winRadio, winRadioRPC, downloadNUM = 0, download = [], downloadCount = 0, setValueInterval, createWindowInterval, updateDownload = 1, updateRetry = 0, updateDownloadFinish = 0, updatePath;
electron_1.app.allowRendererProcessReuse = true;
// app.disableHardwareAcceleration()
electron_1.Menu.setApplicationMenu(menu);
function mkdirSync(dirPath) {
    try {
        fs.mkdirSync(dirPath);
    }
    catch (err) {
        if (err.code !== 'EEXIST')
            throw err;
    }
}
mkdirSync(storageFolderPath);
function rmdirSync(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                rmdirSync(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
function isValidJSON(txt) {
    try {
        JSON.parse(txt);
        return true;
    }
    catch (_a) {
        return false;
    }
}
function transform(byte) {
    if (byte <= 1000)
        return [byte.toFixed(1), 'o'];
    var kilobit = byte / 1000;
    if (kilobit < 1000)
        return [kilobit.toFixed(1), 'Ko'];
    var megabit = kilobit / 1000;
    if (megabit < 1000)
        return [megabit.toFixed(1), 'Mo'];
    var gigabit = megabit / 1000;
    return [gigabit.toFixed(1), 'Go'];
}
function setBlocker(keplerSession, privateSession) {
    return __awaiter(this, void 0, void 0, function () {
        var blocker;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adblocker_electron_1.ElectronBlocker.fromLists(node_fetch_1.default, adblocker_electron_1.fullLists)];
                case 1:
                    blocker = _a.sent();
                    blocker.enableBlockingInSession(keplerSession);
                    blocker.enableBlockingInSession(privateSession);
                    return [2 /*return*/];
            }
        });
    });
}
function addDownload(e, item, update) {
    downloadCount++;
    electron_1.BrowserWindow.getAllWindows().forEach(function (e) { return e.webContents.send('pellet-visible'); });
    var currentDownloadNUM = downloadNUM;
    item.on('updated', function (e, state) {
        if (state === 'interrupted') {
            electron_1.BrowserWindow.getAllWindows().forEach(function (e) { return e.webContents.send('download', ['reload', currentDownloadNUM]); });
            download[currentDownloadNUM].splice(0, 1, 'reload');
        }
        else if (state === 'progressing') {
            if (item.isPaused()) {
                electron_1.BrowserWindow.getAllWindows().forEach(function (e) { return e.webContents.send('download', ['pause', currentDownloadNUM]); });
                download[currentDownloadNUM].splice(0, 1, 'pause');
            }
            else {
                var percent_1 = (item.getReceivedBytes() / item.getTotalBytes()) * 100;
                if (percent_1 != 100) {
                    percent_1 = Math.round(percent_1);
                }
                var speed_1 = item.getReceivedBytes() / ((new Date().getTime() - new Date(item.getStartTime() * 1000).getTime()) / 1000);
                electron_1.BrowserWindow.getAllWindows().forEach(function (e) { return e.webContents.send('download', ['progress', currentDownloadNUM, "" + percent_1, "" + transform(speed_1)[0] + transform(speed_1)[1] + "/s"]); });
                download[currentDownloadNUM].splice(0, 1, 'progress');
                download[currentDownloadNUM].splice(6, 1, "" + percent_1);
                download[currentDownloadNUM].splice(7, 1, "" + transform(speed_1)[0] + transform(speed_1)[1] + "/s");
            }
        }
    });
    item.once('done', function (e, state) {
        if (state === 'completed') {
            electron_1.BrowserWindow.getAllWindows().forEach(function (e) { return e.webContents.send('download', ['succes', currentDownloadNUM, item.getSavePath()]); });
            download[currentDownloadNUM].splice(0, 1, 'success');
            download[currentDownloadNUM].splice(5, 1, item.getSavePath());
        }
        else {
            electron_1.BrowserWindow.getAllWindows().forEach(function (e) { return e.webContents.send('download', ['failure', currentDownloadNUM]); });
            download[currentDownloadNUM].splice(0, 1, 'failure');
        }
        downloadCount = downloadCount - 1;
        if (downloadCount == 0)
            electron_1.BrowserWindow.getAllWindows().forEach(function (e) { return e.webContents.send('pellet-hidden'); });
    });
    electron_1.ipcMain.on("d" + downloadNUM, function (e, arg) {
        if (arg == 'pause') {
            item.pause();
        }
        else if (arg == 'resume' && item.canResume()) {
            if (item.canResume()) {
                item.resume();
            }
            else {
                electron_1.BrowserWindow.getAllWindows().forEach(function (e) { return e.webContents.send('download', ['failure', currentDownloadNUM]); });
            }
        }
        else if (arg == 'cancel') {
            item.cancel();
        }
    });
    if (update === true) {
        download.push(['progress', downloadNUM, item.getFilename(), item.getURL(), item.getTotalBytes(), '', 0, 0, 1]);
        electron_1.BrowserWindow.getAllWindows().forEach(function (e) { return e.webContents.send('download', ['update', downloadNUM, item.getFilename(), item.getURL(), item.getTotalBytes()]); });
    }
    else {
        download.push(['progress', downloadNUM, item.getFilename(), item.getURL(), item.getTotalBytes(), '', 0, 0, 0]);
        electron_1.BrowserWindow.getAllWindows().forEach(function (e) { return e.webContents.send('download', ['add', downloadNUM, item.getFilename(), item.getURL(), item.getTotalBytes()]); });
    }
    downloadNUM++;
}
function quit() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(updateDownload == 0)) return [3 /*break*/, 4];
                    if (!(updateDownloadFinish == 1)) return [3 /*break*/, 1];
                    launchUpdate();
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, saveFiles()];
                case 2:
                    _a.sent();
                    electron_1.app.quit();
                    _a.label = 3;
                case 3: return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, saveFiles()];
                case 5:
                    _a.sent();
                    electron_1.app.quit();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function launchUpdate() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, saveFiles()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, electron_1.shell.openPath(updatePath)];
                case 2:
                    _a.sent();
                    electron_1.app.quit();
                    return [2 /*return*/];
            }
        });
    });
}
function saveFiles() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            mkdirSync(storageFolderPath);
            if (firstFiles[0] != settingFile) {
                fs.writeFile(settingFilePath, JSON.stringify(settingFile), function (err) { });
            }
            if (firstFiles[1] != bookmarkFile) {
                fs.writeFile(bookmarkFilePath, JSON.stringify(bookmarkFile), function (err) { });
            }
            if (firstFiles[2] != windowFile) {
                fs.writeFile(windowFilePath, JSON.stringify(windowFile), function (err) { });
            }
            return [2 /*return*/];
        });
    });
}
function getValues() {
    firstFiles = [];
    fs.readFile(settingFilePath, function (err, settingFileValues) {
        if (settingFileValues === undefined)
            fs.writeFile(settingFilePath, defaultSettingFile, function (err) { });
        settingFile = settingFileValues;
        if (isValidJSON(settingFile) === true) {
            settingFile = JSON.parse(settingFile);
            firstFiles.push(settingFile);
        }
        else {
            return getValues();
        }
        fs.readFile(bookmarkFilePath, function (err, bookmarkFileValue) {
            if (bookmarkFileValue === undefined)
                fs.writeFile(bookmarkFilePath, defaultBookmarkFile, function (err) { });
            bookmarkFile = bookmarkFileValue;
            if (isValidJSON(bookmarkFile) === true) {
                bookmarkFile = JSON.parse(bookmarkFile);
                firstFiles.push(bookmarkFile);
            }
            else {
                return getValues();
            }
            fs.readFile(windowFilePath, function (err, windowFileValues) {
                if (windowFileValues === undefined)
                    fs.writeFile(windowFilePath, defaultWindowFile, function (err) { });
                windowFile = windowFileValues;
                if (isValidJSON(windowFile) === true) {
                    windowFile = JSON.parse(windowFile);
                    firstFiles.push(windowFile);
                }
                else {
                    return getValues();
                }
                canRecoverValue = 1;
            });
        });
    });
}
getValues();
function setValue() {
    if (canRecoverValue == 1) {
        clearInterval(setValueInterval);
        if (settingFile['dimension']['width'] === undefined || settingFile['dimension']['width'] == '') {
            width = 1400;
        }
        else {
            width = Math.round(settingFile['dimension']['width']);
        }
        if (settingFile['dimension']['height'] === undefined || settingFile['dimension']['height'] == '') {
            height = 800;
        }
        else {
            height = Math.round(settingFile['dimension']['height']);
        }
        winDisponibility = 1;
    }
}
function createIntervalWindow(url) {
    if (winWait == 0) {
        firstTabURL = url;
        createWindowInterval = setInterval(createWindow, 200);
        setValueInterval = setInterval(setValue, 50);
        winWait = 1;
    }
}
function createWindow() {
    if (winDisponibility == 1) {
        clearInterval(createWindowInterval);
        win = new electron_1.BrowserWindow({
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
        });
        // electron.nativeTheme.themeSource = 'dark'
        // win.webContents.openDevTools()
        win.loadFile('files/html/index.html');
        win.once('ready-to-show', function () {
            win.show();
            win.focus();
            win.webContents.send('win-radio', radioIsOpen);
            if (downloadCount > 0)
                win.webContents.send('pellet-visible');
            winDisponibility = 0;
            winWait = 0;
            var updateSession = electron_1.session.fromPartition('update');
            updateSession.downloadURL(updateURL);
        });
        win.once('closed', function () {
            if (currentWindow == win)
                currentWindow = null;
        });
    }
}
function openWinRadio() {
    if (radioIsOpen == 0) {
        winRadio = new electron_1.BrowserWindow({
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
        });
        // winRadio.webContents.openDevTools()
        winRadio.loadFile('files/html/radio/index.html');
        winRadio.once('ready-to-show', function () {
            winRadio.show();
            winRadio.focus();
            if (downloadCount > 0)
                winRadio.webContents.send('pellet-visible');
            radioIsOpen = 1;
            electron_1.BrowserWindow.getAllWindows().forEach(function (e) { return e.webContents.send('win-radio', radioIsOpen); });
        });
        winRadio.once('closed', function () {
            radioIsOpen = 0;
            if (radioRPCIsOpen == 1) {
                winRadioRPC.close();
                radioRPCIsOpen = 0;
            }
            electron_1.BrowserWindow.getAllWindows().forEach(function (e) { return e.webContents.send('win-radio', radioIsOpen); });
        });
    }
}
function openWinRadioRPC() {
    if (radioRPCIsOpen == 0) {
        winRadioRPC = new electron_1.BrowserWindow({
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
        });
        winRadioRPC.loadFile('files/html/radio/rpc.html');
        radioRPCIsOpen = 1;
    }
}
if (!gotTheLock) {
    electron_1.app.quit();
}
else {
    electron_1.app.on('second-instance', function (e, commandLine) {
        if (commandLine[2] !== undefined) {
            if (currentWindow === undefined || currentWindow === null) {
                createIntervalWindow(commandLine[2]);
            }
            else {
                currentWindow.webContents.send('tab-end', commandLine[2]);
            }
        }
        else {
            createIntervalWindow('');
        }
    });
    electron_1.app.on('ready', function () {
        if (process.argv.length >= 2) {
            createIntervalWindow(process.argv[1]);
        }
        else
            createIntervalWindow('');
        var keplerSession = electron_1.session.fromPartition('persist:kepler');
        var privateSession = electron_1.session.fromPartition('private');
        var updateSession = electron_1.session.fromPartition('update');
        // privateSession.clearStorageData()
        setBlocker(keplerSession, privateSession);
        keplerSession.on('will-download', function (e, item) {
            addDownload(e, item, false);
        });
        privateSession.on('will-download', function (e, item) {
            addDownload(e, item, false);
        });
        rmdirSync(updateFolderPath);
        updateSession.on('will-download', function (e, item) {
            if (item.getFilename().indexOf('.exe') != -1) {
                item.setSavePath("" + updateFolderPath + item.getFilename());
                updatePath = "" + updateFolderPath + item.getFilename();
                item.on('updated', function (e, state) {
                    if (state === 'interrupted') {
                        if (updateRetry == 5) {
                            item.cancel();
                        }
                        else {
                            item.resume();
                            updateRetry++;
                        }
                    }
                });
                item.once('done', function (e, state) {
                    if (state === 'completed') {
                        updateDownloadFinish = 1;
                    }
                    updateDownload = 0;
                });
                if (thisUpdate == item.getFilename()) {
                    item.cancel();
                }
                else {
                    addDownload(e, item, true);
                }
            }
            else {
                updateDownload = 0;
            }
        });
    });
    electron_1.app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            quit();
        }
    });
    electron_1.app.on('activate', function () {
        if (win === null) {
            createIntervalWindow('');
        }
    });
    electron_1.app.on('browser-window-focus', function (e, window) {
        if (radioIsOpen == 1) {
            if (!winRadio.isFocused())
                currentWindow = window;
        }
        else {
            currentWindow = window;
        }
    });
}
electron_1.ipcMain.on('win-radio-rpc-value', function (e, arg) {
    if (radioRPCIsOpen == 1)
        winRadioRPC.webContents.send('win-radio-rpc-value', arg);
});
electron_1.ipcMain.on('open-win-radio-rpc', function (e, arg) {
    openWinRadioRPC();
});
electron_1.ipcMain.on('open-win-radio', function () {
    openWinRadio();
});
electron_1.ipcMain.on('close-win-radio', function () {
    winRadio.close();
});
electron_1.ipcMain.on('close-win-radio-rpc', function () {
    if (radioRPCIsOpen == 1) {
        winRadioRPC.close();
        radioRPCIsOpen = 0;
    }
});
electron_1.ipcMain.on('bookmark-file', function (e) {
    e.reply('bookmark-file', bookmarkFile);
});
electron_1.ipcMain.on('new-bookmark-file', function (e, arg) {
    bookmarkFile = arg;
    electron_1.BrowserWindow.getAllWindows().forEach(function (e) { return e.webContents.send('bookmark-file', bookmarkFile); });
});
electron_1.ipcMain.on('setting-file', function (e) {
    e.reply('setting-file', settingFile);
});
electron_1.ipcMain.on('reset-setting-file', function () {
    settingFile = JSON.parse(defaultSettingFile);
    electron_1.BrowserWindow.getAllWindows().forEach(function (e) { return e.webContents.send('setting-file', settingFile); });
});
electron_1.ipcMain.on('new-setting-file', function (e, arg) {
    settingFile = arg;
    electron_1.BrowserWindow.getAllWindows().forEach(function (e) { return e.webContents.send('setting-file', settingFile); });
});
electron_1.ipcMain.on('window-file', function (e) {
    e.reply('window-file', windowFile);
});
electron_1.ipcMain.on('new-window-file', function (e, arg) {
    windowFile = arg;
});
electron_1.ipcMain.on('new-window-with-url', function (e, arg) {
    createIntervalWindow(arg);
});
electron_1.ipcMain.on('first-tab', function (e) {
    e.reply('first-tab', [firstTabURL, download]);
    firstTabURL = '';
});
electron_1.ipcMain.on('genocide', function () {
    electron_1.BrowserWindow.getAllWindows().forEach(function (e) {
        if (!e.isFocused()) {
            if (e == winRadio)
                return;
            if (e == winRadioRPC)
                return;
            e.close();
        }
    });
});
electron_1.ipcMain.on('open-file', function (e, arg) {
    if (currentWindow === undefined || currentWindow === null) {
        createIntervalWindow(arg);
    }
    else {
        currentWindow.webContents.send('tab-end', arg);
    }
});
