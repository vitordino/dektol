import { serve, file } from 'bun'
import { join } from 'node:path'
import directoryTree, { DirectoryTree } from 'directory-tree'

// [TODO]: receive cli arg
const BASE_PATH = 'input.example'
const PATH_TYPE_BY_DEPTH = ['root', 'page', 'section', 'file', 'invalid']

const tree = directoryTree(BASE_PATH, { exclude: /.*\/\./g })

type Children = DirectoryTree['children']
type Walk = (parts: string[]) => (children: Children) => Children
const walk: Walk = _parts => children => {
  const parts = _parts.filter(Boolean)
  const [head, ...rest] = parts
  if (parts.length === 0) return children
  if (parts.length === 1) return children?.find(x => x.name === head)?.children
  return walk(rest)(children?.find(x => x.name === head)?.children)
}

type Meta = Partial<{ title: string }>

const getMetaContents = async (input: DirectoryTree): Promise<Meta | undefined> => {
  try {
    const metaItem = input?.children?.find(x => x.name === 'meta.json')
    if (!metaItem) return
    const metaFile = file(metaItem?.path)
    if (!metaFile) return
    return metaFile.json()
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
    : []
  const children = extracted?.filter(x => x.name !== 'meta.json')
  return { ...input, meta, children }
}

serve({
  port: 3000,
  fetch: async req => {
    const pathname = new URL(req.url).pathname
    const depth = pathname.split('/').filter(x => !!x).length
    const pathType = PATH_TYPE_BY_DEPTH[depth]
    switch (pathType) {
      case 'root':
      case 'page':
      case 'section':
        const res = walk(pathname.split('/'))(tree.children)
        const extracted = await extractMeta(tree)
        return new Response(JSON.stringify({ res, tree, extracted }, null, 2))
      case 'file':
        const x = file(decodeURIComponent(join(BASE_PATH, pathname)))
        if (x.size) return new Response(x)
        return new Response('404')
    }
    return new Response('404')
  },
})
