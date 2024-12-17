import type { DirectoryTree } from "directory-tree"

export type Meta = Partial<{
  title: string,
  size: { width?: number, height?: number }
  foreground: string,
  background: string,
}>
export type DirectoryWithMeta = DirectoryTree & { meta?: Meta }
