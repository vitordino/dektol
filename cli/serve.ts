import { serve, file } from 'bun'
import { join } from 'node:path'
import directoryTree from 'directory-tree'

// [TODO]: receive cli arg
const BASE_PATH = 'input.example'
const PATH_TYPE_BY_DEPTH = ['root', 'page', 'section', 'file', 'invalid']

const tree = directoryTree(BASE_PATH, { exclude: /.*\/\./g })

serve({
  port: 3000,
  fetch: async req => {
    const pathname = new URL(req.url).pathname
    const depth = pathname.split('/').filter(x => !!x).length
    const pathType = PATH_TYPE_BY_DEPTH[depth]
    const fsPath = pathType === 'root' ? join(BASE_PATH) : join(BASE_PATH, pathname)
    switch (pathType) {
      case 'root':
        const pages = tree.children
        return new Response(JSON.stringify(pages, null, 2))
      case 'page':
        const sections = tree.children?.find(x => x.path.startsWith(fsPath))?.children
        return new Response(JSON.stringify(sections, null, 2))
      case 'section':
        const [base, page, section] = fsPath.split('/').filter(Boolean)
        const files = tree.children
          ?.find(x => x.path.startsWith(join(base, page)))
          ?.children?.find(x => x.name === section)?.children
        return new Response(JSON.stringify(files, null, 2))
      case 'file':
        const x = file(decodeURIComponent(join(BASE_PATH, pathname)))
        if (x.size) return new Response(x)
        return new Response('404')
    }

    return new Response('404')
  },
})
