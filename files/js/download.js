ipcRenderer.on('download', (e, arg) => {
    if (downloadDisponibility == 1) {
        if (arg[0] == 'add') {
            addDownload(arg)
        } if (arg[0] == 'update') {
            addDownload(arg, true)
            blueAlert(appWords[langApp]['alert']['update']['launch'])
        } else if (arg[0] == 'progress') {
            if (byID(`download${arg[1]}_state`)) byID(`download${arg[1]}_state`).setAttribute('onclick', `ipcRenderer.send('d${arg[1]}', 'pause')`)
            if (byID(`download${arg[1]}_state`)) byID(`download${arg[1]}_state`).setAttribute('class', 'pause')

            if (byID(`download${arg[1]}_percent`)) byID(`download${arg[1]}_percent`).setAttribute('class', `c100 p${arg[2]}`)
            if (byID(`download${arg[1]}_speed`)) byID(`download${arg[1]}_speed`).textContent = arg[3]
        } else if (arg[0] == 'pause') {
            if (byID(`download${arg[1]}_state`)) byID(`download${arg[1]}_state`).setAttribute('onclick', `ipcRenderer.send('d${arg[1]}', 'resume')`)
            if (byID(`download${arg[1]}_state`)) byID(`download${arg[1]}_state`).setAttribute('class', 'resume')
        } else if (arg[0] == 'reload') {
            if (byID(`download${arg[1]}_state`)) byID(`download${arg[1]}_state`).setAttribute('onclick', `ipcRenderer.send('d${arg[1]}', 'resume')`)
            if (byID(`download${arg[1]}_state`)) byID(`download${arg[1]}_state`).setAttribute('class', 'reload')
        } else if (arg[0] == 'succes') {
            if (byID(`download${arg[1]}_state`)) byID(`download${arg[1]}_state`).setAttribute('onclick', `shell.showItemInFolder('${arg[2].replace(/\\/g, '\\\\')}')`)
            if (byID(`download${arg[1]}_state`)) byID(`download${arg[1]}_state`).setAttribute('class', 'folder')

            if (byID(`download${arg[1]}_state_update`)) {
                blueAlert(appWords[langApp]['alert']['update']['success'])

                byID(`download${arg[1]}_state_update`).setAttribute('class', 'state')
                byID(`download${arg[1]}_state_update`).setAttribute('title', appWords[langApp]['download']['update'])
            }

            if (byID(`download${arg[1]}_cancel`)) byID(`download${arg[1]}_cancel`).setAttribute('class', 'cancel_disabled')
            if (byID(`download${arg[1]}_percent`)) byID(`download${arg[1]}_percent`).setAttribute('class', 'c100 p100')
        } else if (arg[0] == 'failure') {
            if (byID(`download${arg[1]}_cancel`)) byID(`download${arg[1]}_cancel`).setAttribute('class', 'cancel_disabled')

            if (byID(`download${arg[1]}_state`)) byID(`download${arg[1]}_state`).removeAttribute('onclick')
            if (byID(`download${arg[1]}_state`)) byID(`download${arg[1]}_state`).setAttribute('class', 'state')
            if (byID(`download${arg[1]}_state`)) byID(`download${arg[1]}_state`).setAttribute('title', appWords[langApp]['download']['failure'])

            if (byID(`download${arg[1]}_state_update`)) {
                yellowAlert(appWords[langApp]['alert']['update']['failed'])
                
                byID(`download${arg[1]}_state_update`).setAttribute('class', 'state')
                byID(`download${arg[1]}_state_update`).setAttribute('title', appWords[langApp]['download']['failure'])
            }
        }
    }
})

function transform(byte) {
    if (byte <= 1000) return [byte.toFixed(1), 'o']

    kilobit = byte / 1000

    if (kilobit < 1000) return [kilobit.toFixed(1), 'Ko']

    megabit = kilobit / 1000

    if (megabit < 1000) return [megabit.toFixed(1), 'Mo']

    gigabit = megabit / 1000

    return [gigabit.toFixed(1), 'Go']
}

function addDownload(arg, update) {
    if (!byID(`download${arg[1]}`)) {
        let a = document.createElement('div')
        a.setAttribute('class', 'download')
        a.setAttribute('id', `download${arg[1]}`)

        let b = document.createElement('button')
        b.setAttribute('class', 'cancel')
        b.setAttribute('id', `download${arg[1]}_cancel`)
        b.setAttribute('onclick', `ipcRenderer.send('d${arg[1]}', 'cancel')`)

        let c = document.createElement('div')

        if (arg[0] != 'add') {
            c.setAttribute('class', `c100 p${arg[6]}`)
        } else {
            c.setAttribute('class', 'c100 p0')
        }

        c.setAttribute('id', `download${arg[1]}_percent`)

        let d = document.createElement('div')
        d.setAttribute('class', 'slice')

        let e = document.createElement('div')
        e.setAttribute('class', 'bar')

        let f = document.createElement('div')
        f.setAttribute('class', 'fill')

        let g = document.createElement('button')

        if (update !== true) {
            g.setAttribute('class', 'pause')
            g.setAttribute('id', `download${arg[1]}_state`)
        } else {
            g.setAttribute('class', 'void')
            g.setAttribute('id', `download${arg[1]}_state_update`)
        }

        let h = document.createElement('h2')
        h.setAttribute('class', 'left')
        h.setAttribute('title', arg[2])

        h.textContent = arg[2]

        let i = document.createElement('p')

        if (update !== true) {
            i.setAttribute('class', 'left')
            i.setAttribute('title', arg[3])

            i.textContent = arg[3]
        } else {
            i.setAttribute('class', 'void')
        }

        let j = document.createElement('p')
        j.setAttribute('class', 'right bottom')
        j.setAttribute('id', `download${arg[1]}_speed`)

        if (arg[0] != 'add') {
            j.textContent = arg[7]
        } else {
            j.textContent = '0o'
        }

        let k = document.createElement('p')
        k.setAttribute('class', 'left bottom')

        k.textContent = `${transform(arg[4])[0]}${transform(arg[4])[1]}`

        if (arg[1] - 1 < 0) {
            download_location.appendChild(a)
        } else {
            download_location.insertBefore(a, byID(`download${arg[1] - 1}`))
        }

        if (arg[0] == 'pause') {
            if (update !== true) {
                g.setAttribute('onclick', `ipcRenderer.send('d${arg[1]}', 'resume')`)
                g.setAttribute('class', 'resume')
            }
        } else if (arg[0] == 'reload') {
            if (update !== true) {
                g.setAttribute('onclick', `ipcRenderer.send('d${arg[1]}', 'resume')`)
                g.setAttribute('class', 'reload')
            }
        } else if (arg[0] == 'success') {
            if (update !== true) {
                g.setAttribute('onclick', `shell.showItemInFolder('${arg[5].replace(/\\/g, '\\\\')}')`)
                g.setAttribute('class', 'folder')
            } else {
                g.removeAttribute('onclick')
                g.setAttribute('class', 'state')

                g.setAttribute('title', appWords[langApp]['download']['update'])
            }

            b.setAttribute('class', 'cancel_disabled')
            c.setAttribute('class', 'c100 p100')
        } else if (arg[0] == 'failure') {
            g.removeAttribute('onclick')
            g.setAttribute('class', 'state')

            b.setAttribute('class', 'cancel_disabled')
            g.setAttribute('title', appWords[langApp]['download']['failure'])
            g.setAttribute('title', appWords[langApp]['download']['failure'])
        }

        a.appendChild(b)
        a.appendChild(c)
        c.appendChild(d)
        d.appendChild(e)
        d.appendChild(f)
        c.appendChild(g)
        a.appendChild(h)
        a.appendChild(i)
        a.appendChild(j)
        a.appendChild(k)
    }
}