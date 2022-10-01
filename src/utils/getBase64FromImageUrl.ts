import { resolve } from 'node:path'
import { readFile, appendFile, mkdir } from 'node:fs/promises'
import memoize from 'p-memoize'
import { encode } from 'base64-arraybuffer'

// tab separated
const SEPARATOR = '\t'
const LINE_BREAK = '\n'
const CACHE_FOLDER = resolve(process.env.PWD || '.', 'node_modules', '.cache')
const CACHE_FILE = resolve(CACHE_FOLDER, 'base64.txt')
const FILE_OPTIONS = { encoding: 'utf-8' } as const

const getImageId = (s?: string | null) => {
  const paths = s?.split('?')[0].split('/')
  return paths?.[paths?.length - 1].split('_')[0] || s
}

const getCache = async (): Promise<string> => {
  await mkdir(resolve(CACHE_FOLDER), { recursive: true })
  await appendFile(CACHE_FILE, '', FILE_OPTIONS)
  return await readFile(CACHE_FILE, FILE_OPTIONS)
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
  await appendFile(CACHE_FILE, [key, value].join(SEPARATOR) + LINE_BREAK, FILE_OPTIONS)
}

type GetBase64FromImageUrl = (url?: string | null) => Promise<string | undefined>
const getBase64FromImageUrl: GetBase64FromImageUrl = async url => {
  const id = getImageId(url)
  if (!url || !id) return
  const valueInCache = await getIdValueInCache(id)
  if (valueInCache) return valueInCache

  const imageData = await fetch(url)
  console.log('[getBase64FromImageUrl]: FETCH: ', id)
  const buffer = await imageData.arrayBuffer()
  const contentType = await imageData.headers.get('content-type')
  const value = `data:image/${contentType};base64,` + encode(buffer)
  await saveKeyValueInCache(id, value)
  return value
}

export default memoize(getBase64FromImageUrl)
