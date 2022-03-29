import MyComponent from '../../../../../src/slices/SingleImage'

export default {
  title: 'src/slices/SingleImage',
}

export const _Default = () => (
  <MyComponent
    slice={{
      variation: 'default',
      name: 'Default',
      slice_type: 'single_image',
      items: [
        {
          image: {
            dimensions: { width: 900, height: 500 },
            alt: 'Placeholder image',
            copyright: null,
            url: 'https://images.unsplash.com/photo-1531771686035-25f47595c87a?w=900&h=500&fit=crop',
          },
        },
        {
          image: {
            dimensions: { width: 900, height: 500 },
            alt: 'Placeholder image',
            copyright: null,
            url: 'https://images.unsplash.com/photo-1586952518485-11b180e92764?w=900&h=500&fit=crop',
          },
        },
      ],
      primary: {},
      id: '_Default',
    }}
  />
)
_Default.storyName = 'Default'
