import { DirectoryWithMeta } from '../../types'

// [TODO]: customize base path to be more flexible (use environment variable)
export const getPathData = (path: string): Promise<DirectoryWithMeta> =>
  fetch(`http://localhost:3001/${path}`).then(x => x.json())
