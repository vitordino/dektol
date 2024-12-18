import { FileSystemPageSchema } from '../types'

// [TODO]: customize base path to be more flexible (use environment variable)
export const getPathData = async (path: string) => {
  const body = await fetch(`http://localhost:3001/${path}`)
  const json = await body.json()
  return FileSystemPageSchema.parse(json)
}
