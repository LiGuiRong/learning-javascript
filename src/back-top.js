let showScrollTopNode = false

window.addEventListener('scroll', handlePageScroll)


function handleBackTop () {
  let scrollTimer = setInterval(() => {
    let sTop = document.body.scrollTop || document.documentElement.scrollTop
    let speed = sTop / 5
    if (document.body.scrollTop !== 0) {
      document.body.scrollTop -= speed
    } else if (document.documentElement.scrollTop !== 0) {
      document.documentElement.scrollTop -= speed
    } else {
      clearInterval(scrollTimer)
    }
  }, 30)
}

function handlePageScroll() {
  let cHeight = document.body.clientHeight || document.documentElement.clientHeight
  let sTop = document.body.scrollTop || document.documentElement.scrollTop
  showScrollTopNode = sTop >= cHeight * 1.5
}
