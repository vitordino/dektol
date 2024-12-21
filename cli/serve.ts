import express from 'express'
import sharp from 'sharp'
import yaml from 'js-yaml'
import { join, extname } from 'node:path'
import { imageSize } from 'image-size'
import directoryTree, { DirectoryTree } from 'directory-tree'
import { readFileSync } from 'fs'

const app = express()

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
    children: input?.children?.map(cleanBasePath),
  }
}

const sortChildren = (input?: DirectoryWithMeta): DirectoryWithMeta | undefined => {
  if (!input?.children?.length) return input
  return {
    ...input,
    children: input?.children?.sort((a, b) => (a.name < b.name ? -1 : 1)).map(sortChildren),
  }
}

const extractImageSize = (input?: DirectoryWithMeta): DirectoryWithMeta | undefined => {
  if (!input) return
  if (input?.children?.length) return { ...input, children: input.children?.map(extractImageSize) }
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
    const fileContent = readFileSync(metaItem.path, 'utf-8')
    if (isJson) return JSON.parse(fileContent)
    return yaml.load(fileContent) as Meta | undefined
  } catch {
    return
  }
}

const extractMeta = async (
  input: DirectoryTree & { meta?: Meta },
): Promise<DirectoryTree & { meta?: Meta }> => {
  const meta = await getMetaContents(input)
  const extracted = input.children?.length
    ? await Promise.all(input.children?.map(item => extractMeta(item)))
    : undefined
  const children = extracted?.filter(x => !META_FILE_NAMES.includes(x.name))
  return { ...input, meta, children }
}

const initializeServer = async () => {
  const treeWithMeta = await extractMeta(tree)

  app.get('*', async (req, res) => {
    const pathname = req.path
    const depth = pathname.split('/').filter(x => !!x).length
    const pathType = PATH_TYPE_BY_DEPTH[depth]

    switch (pathType) {
      case 'root':
      case 'page':
      case 'section':
        const result = sortChildren(
          cleanBasePath(extractImageSize(subtree(pathname.split('/'))(treeWithMeta))),
        )
        return res.json(result)

      case 'file':
        const filePath = decodeURIComponent(join(BASE_PATH, pathname))
        try {
          const height = Number.parseInt(req.query.h as string) || undefined
          const width = Number.parseInt(req.query.w as string) || undefined
          const quality = Number.parseInt(req.query.q as string) || undefined
          const hasParameters = !!height || !!width || !!quality

          if (!hasParameters) {
            return res.sendFile(filePath, { root: process.cwd() })
          }

          const imageBuffer = readFileSync(filePath)
          const compressed = await sharp(imageBuffer)
            .resize({ height, width, withoutEnlargement: true })
            .jpeg({ quality })
            .toBuffer()

          res.contentType('image/jpeg')
          return res.send(compressed)
        } catch (error) {
          return res.status(404).send('404')
        }

      default:
        return res.status(404).send('404')
    }
  })

  app.listen(3001, () => {
    console.log('Server running on port 3001')
  })
}

initializeServer().catch(console.error)
