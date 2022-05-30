// Code generated by prismic-ts-codegen. DO NOT EDIT.

import type * as prismicT from "@prismicio/types";

type Simplify<T> = {
    [KeyType in keyof T]: T[KeyType];
};
/** Content for page documents */
interface PageDocumentData {
    /**
     * background field in *page*
     *
     * - **Field Type**: Color
     * - **Placeholder**: *None*
     * - **API ID Path**: page.background
     * - **Documentation**: https://prismic.io/docs/core-concepts/color
     *
     */
    background: prismicT.ColorField;
    /**
     * foreground field in *page*
     *
     * - **Field Type**: Color
     * - **Placeholder**: *None*
     * - **API ID Path**: page.foreground
     * - **Documentation**: https://prismic.io/docs/core-concepts/color
     *
     */
    foreground: prismicT.ColorField;
    /**
     * Slice Zone (`body`) field in *page*
     *
     * - **Field Type**: Slice Zone
     * - **Placeholder**: *None*
     * - **API ID Path**: page.body[]
     * - **Documentation**: https://prismic.io/docs/core-concepts/slices
     *
     */
    body: prismicT.SliceZone<PageDocumentDataBodySlice>;
}
/**
 * Primary content in page → Slice Zone (`body`) → Horizontal → Primary
 *
 */
interface PageDocumentDataBodyHorizontalSlicePrimary {
    /**
     * background field in *page → Slice Zone (`body`) → Horizontal → Primary*
     *
     * - **Field Type**: Color
     * - **Placeholder**: *None*
     * - **API ID Path**: page.body[].horizontal.primary.background
     * - **Documentation**: https://prismic.io/docs/core-concepts/color
     *
     */
    background: prismicT.ColorField;
    /**
     * foreground field in *page → Slice Zone (`body`) → Horizontal → Primary*
     *
     * - **Field Type**: Color
     * - **Placeholder**: *None*
     * - **API ID Path**: page.body[].horizontal.primary.foreground
     * - **Documentation**: https://prismic.io/docs/core-concepts/color
     *
     */
    foreground: prismicT.ColorField;
}
/**
 * Item in page → Slice Zone (`body`) → Horizontal → Items
 *
 */
export interface PageDocumentDataBodyHorizontalSliceItem {
    /**
     * image field in *page → Slice Zone (`body`) → Horizontal → Items*
     *
     * - **Field Type**: Image
     * - **Placeholder**: *None*
     * - **API ID Path**: page.body[].horizontal.items[].image
     * - **Documentation**: https://prismic.io/docs/core-concepts/image
     *
     */
    image: prismicT.ImageField<null>;
}
export type PageDocumentDataBodyHorizontalSlice = prismicT.Slice<"horizontal", Simplify<PageDocumentDataBodyHorizontalSlicePrimary>, Simplify<PageDocumentDataBodyHorizontalSliceItem>>;
/**
 * Primary content in page → Slice Zone (`body`) → Grid → Primary
 *
 */
interface PageDocumentDataBodyGridSlicePrimary {
    /**
     * background field in *page → Slice Zone (`body`) → Grid → Primary*
     *
     * - **Field Type**: Color
     * - **Placeholder**: *None*
     * - **API ID Path**: page.body[].grid.primary.background
     * - **Documentation**: https://prismic.io/docs/core-concepts/color
     *
     */
    background: prismicT.ColorField;
    /**
     * foreground field in *page → Slice Zone (`body`) → Grid → Primary*
     *
     * - **Field Type**: Color
     * - **Placeholder**: *None*
     * - **API ID Path**: page.body[].grid.primary.foreground
     * - **Documentation**: https://prismic.io/docs/core-concepts/color
     *
     */
    foreground: prismicT.ColorField;
    /**
     * container size field in *page → Slice Zone (`body`) → Grid → Primary*
     *
     * - **Field Type**: Select
     * - **Placeholder**: *None*
     * - **Default Value**: large
     * - **API ID Path**: page.body[].grid.primary.container_size
     * - **Documentation**: https://prismic.io/docs/core-concepts/select
     *
     */
    container_size: prismicT.SelectField<"large" | "medium", "filled">;
}
/**
 * Item in page → Slice Zone (`body`) → Grid → Items
 *
 */
export interface PageDocumentDataBodyGridSliceItem {
    /**
     * image field in *page → Slice Zone (`body`) → Grid → Items*
     *
     * - **Field Type**: Image
     * - **Placeholder**: *None*
     * - **API ID Path**: page.body[].grid.items[].image
     * - **Documentation**: https://prismic.io/docs/core-concepts/image
     *
     */
    image: prismicT.ImageField<null>;
}
export type PageDocumentDataBodyGridSlice = prismicT.Slice<"grid", Simplify<PageDocumentDataBodyGridSlicePrimary>, Simplify<PageDocumentDataBodyGridSliceItem>>;
/**
 * Slice for *page → Slice Zone (`body`)*
 *
 */
type PageDocumentDataBodySlice = PageDocumentDataBodyHorizontalSlice | PageDocumentDataBodyGridSlice;
/**
 * page document from Prismic
 *
 * - **API ID**: `page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/core-concepts/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type PageDocument<Lang extends string = "en-us"> = prismicT.PrismicDocumentWithUID<Simplify<PageDocumentData>, "page", Lang>;
/** Content for x documents */
type XDocumentData = Record<string, never>;
/**
 * x document from Prismic
 *
 * - **API ID**: `x`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/core-concepts/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type XDocument<Lang extends string = "en-us"> = prismicT.PrismicDocumentWithoutUID<Simplify<XDocumentData>, "x", Lang>;
