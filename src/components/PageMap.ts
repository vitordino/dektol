const padding = 64
const y = 32
const height = 2
const wrapperSelector = '.page-map-wrapper'
const canvasSelector = '.page-map-canvas'
const itemSelector = '[data-map="item"]'
const containerSelector = '[data-map="container"]'
const leftBrushSelector = '.page-map-brush-left'
const rightBrushSelector = '.page-map-brush-right'
const middleSelector = '.horizontal-scroll-middle'

type RectTuple = [x: number, y: number, w: number, h: number]
type GetRelativeRect = (totalWidth: number, viewportWidth: number, rect: DOMRect) => RectTuple

const getRelativeRect: GetRelativeRect = (totalWidth, viewportWidth, { x, width }) => {
  const paddedViewportWidth = viewportWidth - 2 * padding
  const paddedTotalWidth = totalWidth - 2 * padding
  const outputX = ((x - padding) / paddedTotalWidth) * paddedViewportWidth + padding
  const outputWidth = (width / paddedTotalWidth) * paddedViewportWidth
  return [outputX, y, outputWidth, height]
}

const wrappers = Array.from(document.querySelectorAll(wrapperSelector))

const drawLines = async () => {
  const dpi = window.devicePixelRatio
  wrappers.forEach(wrapper => {
    const inner = wrapper.querySelector?.('.horizontal-scroll-inner')
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
    context.fillStyle = '000'

    rects.forEach(rect => {
      context.beginPath()
      context.rect(...rect)
      context.fill()
    })
  })
}

const normalizeScale = (n: number) => Math.min(Math.max(n, 0), 1)

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

drawLines()
window.addEventListener('resize', drawLines)

drawBrushes()
window.addEventListener('scroll', drawBrushes)
