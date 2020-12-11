const drake = dragula([document.querySelector('#bookmark')])

let bookmarkPList = byID('bookmark').getElementsByTagName('p'),
  bookmarkDIVList = byID('bookmark').getElementsByTagName('div')

dragula([byID('tab_menu')]).on('dragend', () => {
  if (byID(`${tabID}_input`)) byID(`${tabID}_input`).checked = true
})

drake.on('drag', (el) => {
  if (el.id == 'plus') drake.end()
})

drake.on('drop', () => {
  checkBookmark()
})

drake.on('drag', () => {
  tempSetInvisibilityBookmarkUI()
})