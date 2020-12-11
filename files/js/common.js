function disableButton(idElement) {
  if (byID(idElement)) byID(idElement).setAttribute('id', `${idElement}_disabled`)
  if (byID(`${idElement}_disabled`)) byID(`${idElement}_disabled`).setAttribute('disabled', 'true')
}

function enableButton(idElement) {
  if (byID(`${idElement}_disabled`)) byID(`${idElement}_disabled`).setAttribute('id', idElement)
  if (byID(idElement)) byID(idElement).removeAttribute('disabled')
}

function byID(id) {
  return document.getElementById(id)
}

ipcRenderer.on('pellet-visible', () => {
  if (byID('pellet')) byID('pellet').style.opacity = '1'
})

ipcRenderer.on('pellet-hidden', () => {
  if (byID('pellet')) byID('pellet').style.opacity = '0'
})