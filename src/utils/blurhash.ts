import memoize from 'p-memoize'

const getImageId = (s?: string | null) => /(?=[^\/]+$).+(?=\?)/g.exec(s || '')?.[0] || s

type CacheKey = (args: [url?: string | null | undefined]) => string | null | undefined
const cacheKey: CacheKey = ([k]) => getImageId(k)

type GetBlurhashURIFromUrl = (url?: string | null) => Promise<string | undefined>
export const getBlurhashURIFromUrl: GetBlurhashURIFromUrl = async url => {
  if (!url) return
  console.log('[getBlurhashURIFromUrl]', getImageId(url))
  const imageUrlData = await fetch(url)
  // @ts-ignore-error
  const buffer = await imageUrlData.buffer()
  const contentType = await imageUrlData.headers.get('content-type')
  return `data:image/${contentType};base64,` + buffer.toString('base64')
}

export const memoizedBlurhash = memoize(getBlurhashURIFromUrl, { cacheKey })
