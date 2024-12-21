import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { join, extname } from 'node:path'
import directoryTree from 'directory-tree'
import type { DirectoryTree } from 'directory-tree'
import sharp from 'sharp'
import yaml from 'js-yaml'
import { imageSize } from 'image-size'

type Meta = Partial<{
  title: string
  size: { width?: number; height?: number }
  foreground: string
  background: string
}>
type DirectoryWithMeta = DirectoryTree & { meta?: Meta }

const BASE_PATH = 'input'
const PATH_TYPE_BY_DEPTH = ['root', 'page', 'section', 'file', 'invalid']
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.svg', '.gif', '.webp', '.heic']

const tree = directoryTree(BASE_PATH, { exclude: /.*\/\./g })

type Subtree = (parts: string[]) => (input?: DirectoryWithMeta) => DirectoryWithMeta | undefined
const subtree: Subtree = _parts => input => {
  if (!input) return
  const parts = _parts.filter(Boolean)
  const [head, ...rest] = parts
  if (parts.length === 0) return input
  if (parts.length === 1) return input?.children?.find(x => x.name === head)
  const next = input?.children?.find(x => x.name === head)
  if (!next) return
  return subtree(rest)(next)
}

const removeBasePath = (path: string) =>
  path === BASE_PATH ? '' : path.replace(BASE_PATH + '/', '')
const cleanBasePath = (input?: DirectoryWithMeta): DirectoryWithMeta | undefined => {
  if (!input) return
  return {
    ...input,
    name: removeBasePath(input.name),
    path: removeBasePath(input.path),
    // @ts-expect-error typescript is not able to pull the typing
    children: input?.children?.map(cleanBasePath),
  }
}

const sortChildren = (input?: DirectoryWithMeta): DirectoryWithMeta | undefined => {
  if (!input?.children?.length) return input
  return {
    ...input,
    // @ts-expect-error typescript is not able to pull the typing
    children: input?.children?.sort((a, b) => (a.name < b.name ? -1 : 1)).map(sortChildren),
  }
}

const extractImageSize = (input?: DirectoryWithMeta): DirectoryWithMeta | undefined => {
  if (!input) return
  if (input?.children?.length) {
    return {
      ...input,
      // @ts-expect-error typescript is not able to pull the typing
      children: input.children?.map(extractImageSize),
    }
  }
  const extension = extname(input.name || '')
  const isImage = extension && IMAGE_EXTENSIONS.includes(extension)
  if (!isImage) return input
  const { width, height } = imageSize(input.path)
  return { ...input, meta: { size: { width, height } } }
}

const META_FILE_NAMES = ['meta.yaml', 'meta.yml', 'meta.json']
const getMetaContents = async (input: DirectoryTree): Promise<Meta | undefined> => {
  try {
    const metaItem = input?.children?.find(x => META_FILE_NAMES.includes(x.name))
    const isJson = metaItem?.name.endsWith('.json')
    if (!metaItem) return
    const fileContent = await readFile(metaItem.path, 'utf-8')
    if (isJson) return JSON.parse(fileContent)
    return yaml.load(fileContent) as Meta | undefined
  } catch {
    return
  }
}

const extractMeta = async (input: DirectoryTree): Promise<DirectoryWithMeta> => {
  const meta = await getMetaContents(input)
  const extracted = input.children?.length
    ? await Promise.all(input.children?.map(item => extractMeta(item)))
    : undefined
  const children = extracted?.filter(x => !META_FILE_NAMES.includes(x.name))
  return { ...input, meta, children }
}

const initializeServer = async () => {
  const treeWithMeta = await extractMeta(tree)

  const server = createServer(async (req, res) => {
    const url = new URL(req.url!, `http://${req.headers.host}`)
    const pathname = url.pathname
    const depth = pathname.split('/').filter(x => !!x).length
    const pathType = PATH_TYPE_BY_DEPTH[depth]

    switch (pathType) {
      case 'root':
      case 'page':
      case 'section': {
        const result = sortChildren(
          cleanBasePath(extractImageSize(subtree(pathname.split('/'))(treeWithMeta))),
        )
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify(result, null, 2))
      }

      case 'file': {
        const filePath = decodeURIComponent(join(BASE_PATH, pathname))
        try {
          const height = Number.parseInt(url.searchParams.get('h') || '') || undefined
          const width = Number.parseInt(url.searchParams.get('w') || '') || undefined
          const quality = Number.parseInt(url.searchParams.get('q') || '') || undefined
          const hasParameters = !!height || !!width || !!quality

          if (!hasParameters) {
            const fileContent = await readFile(filePath)
            res.writeHead(200, { 'Content-Type': 'image/jpeg' })
            return res.end(fileContent)
          }

          const imageBuffer = await readFile(filePath)
          const compressed = await sharp(imageBuffer)
            .resize({ height, width, withoutEnlargement: true })
            .jpeg({ quality })
            .toBuffer()

          res.writeHead(200, { 'Content-Type': 'image/jpeg' })
          return res.end(compressed)
        } catch (error) {
          res.writeHead(404)
          return res.end('404')
        }
      }

      default:
        res.writeHead(404)
        return res.end('404')
    }
  })

  server.listen(3001, () => console.log('Server running on port 3001'))
}

initializeServer().catch(console.error)
