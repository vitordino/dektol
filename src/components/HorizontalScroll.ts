const middle = '.horizontal-scroll-middle'
const inner = '.horizontal-scroll-inner'
const isVertical = window.innerWidth < 720

const setParentSticky = (element: Element, value: boolean) =>
  element.parentElement?.setAttribute('data-sticky', value.toString())

const onScroll = () =>
  document.querySelectorAll(middle).forEach(container => {
    const innerElement = container.querySelector(inner)
    if (!container || !innerElement) return
    const { y } = container.getBoundingClientRect()

    const isBeforeSection = y > 0
    const reachedLeftEnd = innerElement.scrollLeft === 0

    const isAfterSection = -y > innerElement.scrollWidth - window.innerWidth
    const reachedRightEnd = innerElement.scrollLeft <= innerElement.scrollWidth

    const isOutOfBounds = (isBeforeSection && reachedLeftEnd) || (isAfterSection && reachedRightEnd)

    const shouldBeSticky = !isOutOfBounds

    setParentSticky(container, shouldBeSticky)
    if (shouldBeSticky) innerElement.scrollLeft = -y
  })

const setStickyContainersSize = () =>
  document.querySelectorAll(middle).forEach(container => {
    const innerElement = container.querySelector(inner)
    if (!innerElement) return
    const stickyContainerHeight = innerElement.scrollWidth + window.innerHeight - window.innerWidth
    container.setAttribute('style', 'height: ' + stickyContainerHeight + 'px')
  })

const resetStickyContainersSize = () =>
  document.querySelectorAll(middle).forEach(container => {
    container.removeAttribute('style')
  })

const listen = () => {
  window.addEventListener('scroll', onScroll)
  setStickyContainersSize()
}
const unlisten = () => {
  window.removeEventListener('scroll', onScroll)
  resetStickyContainersSize()
}

window.addEventListener('load', listen)
window.addEventListener('resize', () => {
  unlisten()
  if (!isVertical) listen()
})
