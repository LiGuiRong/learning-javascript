;(function(doc, win) {
  let docEl = document.documentElement
  let resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize'
  let recalc = function () {
    let clientWidth = docEl.clientWidth
    if (!clientWidth) return
    if (clientWidth >= 640) {
      docEl.style.fontSize = '100px'
    } else {
      docEl.style.fontSize = 100 * (clientWidth / 640) + 'px'
    }
    win.addEventListener(resizeEvent, recalc, false)
    doc.addEventListener('DOMContentLoaded', recalc, false)
  }
})(document, window)
