import React from "react";
import type { SingleImageSliceProps } from "slices/types";

const SingleImage = ({ slice }: SingleImageSliceProps) => (
  <>
    {slice.items?.map(({ image }) => (
      <img key={image.url} src={image.url} alt={image.alt} />
    ))}
  </>
);

export default SingleImage;
