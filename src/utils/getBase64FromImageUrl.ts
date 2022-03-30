import memoize from 'p-memoize'

const getImageId = (s?: string | null) => /(?=[^\/]+$).+(?=\?)/g.exec(s || '')?.[0] || s

type GetBase64FromImageUrl = (url?: string | null) => Promise<string | undefined>
export const getBase64FromImageUrl: GetBase64FromImageUrl = async url => {
  if (!url) return
  console.log('[getBase64FromImageUrl]', getImageId(url))
  const imageData = await fetch(url)
  // @ts-ignore-error
  const buffer = await imageData.buffer()
  const contentType = await imageData.headers.get('content-type')
  return `data:image/${contentType};base64,` + buffer.toString('base64')
}

export const memoizedGetBase64FromImageUrl = memoize(getBase64FromImageUrl)
