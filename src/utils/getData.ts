import { FileSystemRootSchema } from '../types'

// [TODO]: customize base path to be more flexible (use environment variable)
export const getData = async () => {
  const body = await fetch('http://localhost:3001/')
  const json = await body.json()
  return FileSystemRootSchema.parse(json)
}
