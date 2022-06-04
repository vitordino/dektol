import rgbToHex from 'rgb-hex'

if (typeof window.queueMicrotask !== 'function') {
  window.queueMicrotask = callback => Promise.resolve().then(callback)
}

const padding = 64
const y = 32
const height = 2

let isListening = false

const wrapperSelector = '.horizontal-slice-wrapper'
const middleSelector = '.horizontal-slice-middle'
const innerSelector = '.horizontal-slice-inner'

const canvasSelector = '.horizontal-slice-map-canvas'
const containerSelector = '[data-map="container"]'
const itemSelector = '[data-map="item"]'
const leftBrushSelector = '.horizontal-slice-map-brush-left'
const rightBrushSelector = '.horizontal-slice-map-brush-right'

const wrappers = document.querySelectorAll(wrapperSelector)

const normalizeScale = (n: number) => Math.min(Math.max(n, 0), 1)

// this is a non-passive event handler, if it gets expensive ux will suffer
const onWheel = (event: WheelEvent) => {
  const isScrollingVertically = Math.abs(event.deltaY) > Math.abs(event.deltaX)
  if (isScrollingVertically) return

  const isScrollingLeft = event.deltaX < 0
  if (window.scrollY === 0 && isScrollingLeft) return

  const { scrollHeight, scrollTop, clientHeight } = document.documentElement
  const hasReachedScrollEnd = scrollHeight - scrollTop === clientHeight
  if (hasReachedScrollEnd && !isScrollingLeft) return

  event.preventDefault()
  window.scroll(0, window.scrollY + event.deltaX)
}

const getHexCurrentColor = (element?: Element | null) =>
  element ? '#' + rgbToHex(getComputedStyle(element).color) : null

const updateHorizontalScroll = () =>
  wrappers.forEach(wrapper => {
    const middle = wrapper.querySelector(middleSelector)
    const inner = wrapper.querySelector(innerSelector)
    if (!wrapper || !middle || !inner) return
    const { y } = middle.getBoundingClientRect()
    const shouldBeSticky = -y >= 0 && -y <= inner.scrollWidth - window.innerWidth
    wrapper.setAttribute('data-sticky', shouldBeSticky.toString())
    inner.scrollLeft = -y
  })

const setStickyContainersSize = () =>
  document.querySelectorAll(middleSelector).forEach(middle => {
    const inner = middle.querySelector(innerSelector)
    if (!inner) return
    const stickyContainerHeight = inner.scrollWidth + window.innerHeight - window.innerWidth - 1
    middle.setAttribute('style', 'height: ' + stickyContainerHeight + 'px')
  })

const resetStickyContainersSize = () =>
  document.querySelectorAll(middleSelector).forEach(middle => middle.removeAttribute('style'))

type RectTuple = [x: number, y: number, w: number, h: number]
type GetRelativeRect = (totalWidth: number, viewportWidth: number, rect: DOMRect) => RectTuple

const getRelativeRect: GetRelativeRect = (totalWidth, viewportWidth, { x, width }) => {
  const paddedViewportWidth = viewportWidth - 2 * padding
  const paddedTotalWidth = totalWidth - 2 * padding
  const outputX = ((x - padding) / paddedTotalWidth) * paddedViewportWidth + padding
  const outputWidth = (width / paddedTotalWidth) * paddedViewportWidth
  return [outputX, y, outputWidth, height]
}

const drawLines = async () => {
  const dpi = window.devicePixelRatio
  wrappers.forEach(wrapper => {
    const inner = wrapper.querySelector?.('.horizontal-slice-inner')
    const canvas: HTMLCanvasElement | null = wrapper.querySelector(canvasSelector)
    const container = wrapper.querySelector(containerSelector)
    const items = Array.from(wrapper.querySelectorAll(itemSelector))
    const context = canvas?.getContext('2d')

    if (!container || !inner || !canvas || !context) return

    inner.scrollLeft = 0

    const totalWidth = Math.max(container.scrollWidth, container.clientWidth)
    const viewportWidth = canvas.clientWidth
    const getRelativeContextRect = (rect: DOMRect) =>
      getRelativeRect(totalWidth, viewportWidth, rect)

    canvas.width = canvas.clientWidth * dpi
    canvas.height = canvas.clientHeight * dpi
    context.scale(dpi, dpi)

    const rects = items.map(x => getRelativeContextRect(x.getBoundingClientRect()))

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = getHexCurrentColor(wrapper) || '#000'

    rects.forEach(rect => {
      context.beginPath()
      context.rect(...rect)
      context.fill()
    })
  })
}

const drawBrushes = () => {
  wrappers.forEach(wrapper => {
    const container = wrapper.querySelector(containerSelector)
    const middle = wrapper.querySelector(middleSelector)

    const leftBrush: HTMLElement | null = wrapper.querySelector(leftBrushSelector)
    const rightBrush: HTMLElement | null = wrapper.querySelector(rightBrushSelector)

    if (!container || !middle || !leftBrush || !rightBrush) return

    const { y: initialY } = container.getBoundingClientRect()
    const { y } = middle.getBoundingClientRect()

    const totalWidth = Math.max(container.scrollWidth, container.clientWidth)
    const viewportWidth = window.innerWidth
    const scaleLeft = (-y - initialY - padding) / (totalWidth - 2 * padding)
    const scaleRight = 1 - viewportWidth / (totalWidth - 2 * padding) - scaleLeft

    leftBrush.style.transform = `scaleX(${normalizeScale(scaleLeft)})`
    rightBrush.style.transform = `scaleX(${normalizeScale(scaleRight)})`
  })
}

const onScroll = () => {
  updateHorizontalScroll()
  drawBrushes()
}

const listen = () => {
  let isUpdating = false
  window.queueMicrotask(() => {
    if (isUpdating) return
    isUpdating = true
    setStickyContainersSize()
    drawLines()
    drawBrushes()
  })
  if (isListening) return
  isListening = true
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('scroll', onScroll)
}
const unlisten = () => {
  let isUpdating = false
  window.queueMicrotask(() => {
    if (isUpdating) return
    isUpdating = true
    resetStickyContainersSize()
  })
  if (!isListening) return
  isListening = false
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('scroll', onScroll)
}

const init = () => (window.innerWidth < 720 ? unlisten() : listen())

window.addEventListener('load', init)
window.addEventListener('resize', init)
