import type {
  PrismicDocument,
  KeyTextField,
  SliceZone,
  SharedSlice,
  SharedSliceVariation,
  ImageField,
} from '@prismicio/types'

export type SingleImageSlice = SharedSlice<
  'SingleImage',
  SharedSliceVariation<'Default', {}, { image: ImageField }>
>

export type CollectionDocument = PrismicDocument<{
  name: KeyTextField
  slices: SliceZone<SingleImageSlice>
}>
