/* global Stats */

export const stats = new Stats()
stats.showPanel(0)
stats.dom.id = 'stats'
stats.dom.style = undefined

export function initStats () {
  document.getElementsByClassName('folder')[3]
    .firstChild.firstChild.childNodes[1]
    .appendChild(stats.dom)
}
