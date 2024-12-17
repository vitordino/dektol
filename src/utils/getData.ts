import { DirectoryWithMeta } from '../../types'

// [TODO]: customize base path to be more flexible (use environment variable)
export const getData = (): Promise<DirectoryWithMeta> =>
  fetch('http://localhost:3001/').then(x => x.json())
