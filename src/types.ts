import { ColorField, ImageField } from '@prismicio/types'

export type Edges<T> = { edges: { node: T }[] }

export type Colors = {
  background: ColorField
  foreground: ColorField
}

export type Meta = { _meta: { uid: string } }

export type HorizontalSlice = {
  type: 'horizontal'
  primary: Colors
  fields: { image: ImageField }[]
}

export type UnknownSlice = { type: string }

export type Slice = HorizontalSlice | UnknownSlice
export type Page = Meta & Colors & { body: Slice[] }
export type HomePage = { allPages: Edges<Page> }
