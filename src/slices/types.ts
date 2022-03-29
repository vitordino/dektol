import SingleImageMock from '../.slicemachine/assets/slices/SingleImage/mocks.json'

export type SingleImageSliceProps = {
  slice: Partial<typeof SingleImageMock[number]> & { id?: string }
}
