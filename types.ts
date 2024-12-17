import type { DirectoryTree } from "directory-tree"

export type Meta = Partial<{ title: string }>
export type DirectoryWithMeta = DirectoryTree & { meta?: Meta }
