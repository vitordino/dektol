import sharp from 'sharp'
import { encode, decode } from 'blurhash'
import { createCanvas, loadImage, Image } from 'canvas'

type Dimensions = { width: number; height: number }
type CanvasOptions = { size: number; quality: number; channels: 1 | 2 | 4 }

const DEFAULT_OPTIONS = { size: 16, quality: 40, channels: 4 } as const

const getImageData = (image: Image) => {
  const canvas = createCanvas(image.width, image.height)
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0)
  return context.getImageData(0, 0, image.width, image.height)
}

const generateBlurhashStringFromUrl = async (url: string, channels = DEFAULT_OPTIONS.channels) => {
  const image = await loadImage(url)
  console.log(' image = ', image.width, image.height)
  const imageData = getImageData(image)
  return encode(imageData.data, imageData.width, imageData.height, channels, channels)
}

const generateImageURIFromHash = async (
  hash: string,
  { width, height }: Dimensions,
  options: CanvasOptions = DEFAULT_OPTIONS,
) => {
  const hashWidth = options.size
  const hashHeight = Math.round(hashWidth * (height / width))
  const pixels = decode(hash, hashWidth, hashHeight)
  const raw = { channels: options.channels, width: hashWidth, height: hashHeight } as const
  const resizedImageBuf = await sharp(Buffer.from(pixels), { raw })
    .jpeg({ overshootDeringing: true, quality: options.quality })
    .toBuffer() // Here also possible to do whatever with your image, e.g. save it or something else.

  return `data:image/jpeg;base64,${resizedImageBuf.toString('base64')}`
}

export const getBlurhashURIFromUrl = async (
  url?: string | null,
  dimensions?: Dimensions | null,
) => {
  if (!url || !dimensions) return
  const blurhashString = await generateBlurhashStringFromUrl(url)
  return generateImageURIFromHash(blurhashString, dimensions)
}
