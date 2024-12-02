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
        return new Response(JSON.stringify(res, null, 2))
      case 'file':
        const x = file(decodeURIComponent(join(BASE_PATH, pathname)))
        if (x.size) return new Response(x)
        return new Response('404')
    }
    return new Response('404')
  },
})
