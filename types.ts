import { z } from 'zod'

export const BaseFileSystemSchema = z.object({ name: z.string(), path: z.string() })
export type BaseFileSystemSchema = z.infer<typeof BaseFileSystemSchema>

export const FileSystemImageSchema = BaseFileSystemSchema.extend({
  meta: z.object({ size: z.object({ width: z.number(), height: z.number() }) }).required(),
})
export type FileSystemImageSchema = z.infer<typeof FileSystemImageSchema>

export const FileSystemSectionSchema = BaseFileSystemSchema.extend({
  children: z.array(FileSystemImageSchema),
  meta: z
    .object({
      title: z.string().optional(),
      foreground: z.string().optional(),
      background: z.string().optional(),
    })
    .optional(),
})
export type FileSystemSectionSchema = z.infer<typeof FileSystemSectionSchema>

export const FileSystemPageSchema = BaseFileSystemSchema.extend({
  children: z.array(FileSystemSectionSchema),
  meta: z
    .object({
      title: z.string().optional(),
      foreground: z.string().optional(),
      background: z.string().optional(),
      hidden: z.boolean().optional(),
    })
    .optional(),
})
export type FileSystemPageSchema = z.infer<typeof FileSystemPageSchema>

export const FileSystemRootSchema = BaseFileSystemSchema.extend({
  children: z.array(FileSystemPageSchema),
  meta: z
    .object({
      title: z.string().optional(),
      foreground: z.string().optional(),
      background: z.string().optional(),
    })
    .optional(),
})
export type FileSystemRootSchema = z.infer<typeof FileSystemRootSchema>
