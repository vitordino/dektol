import { serve, file } from 'bun'
import sharp from 'sharp'
import yaml from 'js-yaml'
import { join, extname } from 'node:path'
import { imageSize } from 'image-size'
import directoryTree, { DirectoryTree } from 'directory-tree'
import { DirectoryWithMeta, Meta } from '../types'

// [TODO]: receive cli arg
const BASE_PATH = 'input.example'
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
    // @ts-expect-error
    children: input?.children?.map(cleanBasePath),
  }
}
const sortChildren = (input?: DirectoryWithMeta): DirectoryWithMeta | undefined => {
  if (!input?.children?.length) return input
  return {
    ...input,
    // @ts-expect-error
    children: input?.children?.sort((a, b) => (a.name < b.name ? -1 : 1)).map(sortChildren),
  }
}

const extractImageSize = (input?: DirectoryWithMeta): DirectoryWithMeta | undefined => {
  if (!input) return
  // @ts-expect-error
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
    const metaFile = file(metaItem?.path)
    if (!metaFile) return
    if (isJson) return metaFile.json()
    const text = await metaFile.text()
    return yaml.load(text) as Meta | undefined
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

const treeWithMeta = await extractMeta(tree)

serve({
  port: 3001,
  fetch: async req => {
    const { pathname, searchParams } = new URL(req.url)
    const depth = pathname.split('/').filter(x => !!x).length
    const pathType = PATH_TYPE_BY_DEPTH[depth]
    switch (pathType) {
      case 'root':
      case 'page':
      case 'section':
        const res = sortChildren(
          cleanBasePath(extractImageSize(subtree(pathname.split('/'))(treeWithMeta))),
        )
        return new Response(JSON.stringify(res, null, 2))
      case 'file':
        const x = file(decodeURIComponent(join(BASE_PATH, pathname)))
        if (!x?.size) return new Response('404')
        const height = Number.parseInt(searchParams.get('h') || '') || undefined
        const width = Number.parseInt(searchParams.get('w') || '') || undefined
        const quality = Number.parseInt(searchParams.get('q') || '') || undefined
        const hasParameters = !!height || !!width || !!quality
        if (!hasParameters) return new Response(x)
        const buffer = await x.arrayBuffer()
        const compressed = await sharp(buffer)
          .resize({ height, width, withoutEnlargement: true })
          .jpeg({ quality })
          .toBuffer()
        return new Response(compressed, { headers: { 'Content-Type': 'image/jpg' }, status: 200 })
    }
    return new Response('404')
  },
})
