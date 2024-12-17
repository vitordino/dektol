import type { DirectoryTree } from "directory-tree"

export type Meta = Partial<{ title: string, size: { width?: number, height?: number } }>
export type DirectoryWithMeta = DirectoryTree & { meta?: Meta }
