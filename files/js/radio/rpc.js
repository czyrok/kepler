const electron = require('electron'),
    { ipcRenderer } = electron,
    DiscordRPC = require('discord-rpc'),
    clientId = '768919422043684886',
    rpc = new DiscordRPC.Client({ transport: 'ipc' })

let rpcReady = false,
    startTimestamp = new Date(),
    musicName,
    musicArtist

async function setActivity() {
    rpc.setActivity({
        startTimestamp,
        details: musicName,
        state: musicArtist,
        largeImageKey: 'allzic',
        largeImageText: 'AllZic Radio',
        smallImageKey: 'icon',
        smallImageText: 'Kepler',
        instance: false,
    })
}

function loginRPC() {
    rpc.login({ clientId }).catch(setTimeout(loginRPC, 5e3))
}

loginRPC()

rpc.on('ready', () => {
    rpcReady = true
})

ipcRenderer.on('win-radio-rpc-value', (event, arg) => {
    musicName = arg[0]
    musicArtist = arg[1]

    if (rpcReady === true) setActivity()
})