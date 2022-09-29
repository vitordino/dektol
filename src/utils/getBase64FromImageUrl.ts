import memoize from 'p-memoize'
import { resolve } from 'node:path'
import { readFile, appendFile, writeFile } from 'node:fs/promises'
import { encode } from 'base64-arraybuffer'

const isDev = process.env.NODE_ENV === 'development'
// tab separated
const SEPARATOR = '\t'
const LINE_BREAK = '\n'
const CACHE_PATH = resolve('.', '.cache', 'base64.txt')
const FILE_OPTIONS = { encoding: 'utf-8' } as const

const getImageId = (s?: string | null) => {
  const paths = s?.split('?')[0].split('/')
  return paths?.[paths?.length - 1].split('_')[0] || s
}

const getCache = async () => {
  try {
    await appendFile(CACHE_PATH, '', FILE_OPTIONS)
    return await readFile(CACHE_PATH, FILE_OPTIONS)
  } catch {
    try {
      await writeFile(CACHE_PATH, '', FILE_OPTIONS)
      return await ''
    } catch {
      return await ''
    }
  }
}

const getIdValueInCache = async (id: string) => {
  const cache = await getCache()
  if (!cache) return null
  const lines = cache.split(LINE_BREAK)
  for (const line of lines) {
    const [key, value] = line.split(SEPARATOR)
    if (key === id) {
      console.log('[getBase64FromImageUrl]: CACHE HIT: ', id)
      return value
    }
  }
  return null
}

const saveKeyValueInCache = async (key: string, value: string) => {
  console.log('[getBase64FromImageUrl]: CACHE SAVE: ', key)
  await appendFile(CACHE_PATH, [key, value].join(SEPARATOR) + LINE_BREAK, FILE_OPTIONS)
}

type GetBase64FromImageUrl = (url?: string | null) => Promise<string | undefined>
const getBase64FromImageUrl: GetBase64FromImageUrl = async url => {
  const id = getImageId(url)
  if (!url || !id) return
  if (isDev) {
    const valueInCache = await getIdValueInCache(id)
    if (valueInCache) return valueInCache
  }

  const imageData = await fetch(url)
  console.log('[getBase64FromImageUrl]: FETCH: ', id)
  const buffer = await imageData.arrayBuffer()
  const contentType = await imageData.headers.get('content-type')
  const value = `data:image/${contentType};base64,` + encode(buffer)
  if (isDev) await saveKeyValueInCache(id, value)
  return value
}

export default memoize(getBase64FromImageUrl)
