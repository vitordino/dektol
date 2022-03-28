import MyComponent from "../../../../slices/SingleImage";

export default {
  title: "slices/SingleImage",
};

export const _Default = () => (
  <MyComponent
    slice={{
      variation: "default",
      name: "Default",
      slice_type: "single_image",
      items: [
        {
          image: {
            dimensions: { width: 900, height: 500 },
            alt: "Placeholder image",
            copyright: null,
            url: "https://images.unsplash.com/photo-1571126770897-2d612d1f7b89?w=900&h=500&fit=crop",
          },
        },
        {
          image: {
            dimensions: { width: 900, height: 500 },
            alt: "Placeholder image",
            copyright: null,
            url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=900&h=500&fit=crop",
          },
        },
        {
          image: {
            dimensions: { width: 900, height: 500 },
            alt: "Placeholder image",
            copyright: null,
            url: "https://images.unsplash.com/photo-1596195689404-24d8a8d1c6ea?w=900&h=500&fit=crop",
          },
        },
      ],
      primary: {},
      id: "_Default",
    }}
  />
);

_Default.storyName = "Default";
