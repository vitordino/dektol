// Code generated by prismic-ts-codegen. DO NOT EDIT.

import type * as prismicT from "@prismicio/types";

type Simplify<T> = {
    [KeyType in keyof T]: T[KeyType];
};
/** Content for home documents */
interface HomeDocumentData {
    /**
     * background field in *home*
     *
     * - **Field Type**: Color
     * - **Placeholder**: *None*
     * - **API ID Path**: home.background
     * - **Documentation**: https://prismic.io/docs/core-concepts/color
     *
     */
    background: prismicT.ColorField;
    /**
     * foreground field in *home*
     *
     * - **Field Type**: Color
     * - **Placeholder**: *None*
     * - **API ID Path**: home.foreground
     * - **Documentation**: https://prismic.io/docs/core-concepts/color
     *
     */
    foreground: prismicT.ColorField;
    /**
     * Slice Zone (`body`) field in *home*
     *
     * - **Field Type**: Slice Zone
     * - **Placeholder**: *None*
     * - **API ID Path**: home.body[]
     * - **Documentation**: https://prismic.io/docs/core-concepts/slices
     *
     */
    body: prismicT.SliceZone<HomeDocumentDataBodySlice>;
    /**
     * meta title field in *home*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: home.meta_title
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    meta_title: prismicT.KeyTextField;
    /**
     * meta description field in *home*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: home.meta_description
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    meta_description: prismicT.KeyTextField;
    /**
     * meta image field in *home*
     *
     * - **Field Type**: Image
     * - **Placeholder**: *None*
     * - **API ID Path**: home.meta_image
     * - **Documentation**: https://prismic.io/docs/core-concepts/image
     *
     */
    meta_image: prismicT.ImageField<null>;
}
/**
 * Item in home → Slice Zone (`body`) → home items → Items
 *
 */
export interface HomeDocumentDataBodyHomeItemsSliceItem {
    /**
     * items field in *home → Slice Zone (`body`) → home items → Items*
     *
     * - **Field Type**: Content Relationship
     * - **Placeholder**: *None*
     * - **API ID Path**: home.body[].home_items.items[].items
     * - **Documentation**: https://prismic.io/docs/core-concepts/link-content-relationship
     *
     */
    items: prismicT.RelationField<"page">;
}
export type HomeDocumentDataBodyHomeItemsSlice = prismicT.Slice<"home_items", Record<string, never>, Simplify<HomeDocumentDataBodyHomeItemsSliceItem>>;
/**
 * Slice for *home → Slice Zone (`body`)*
 *
 */
type HomeDocumentDataBodySlice = HomeDocumentDataBodyHomeItemsSlice;
/**
 * home document from Prismic
 *
 * - **API ID**: `home`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/core-concepts/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomeDocument<Lang extends string = "en-us"> = prismicT.PrismicDocumentWithoutUID<Simplify<HomeDocumentData>, "home", Lang>;
/** Content for page documents */
interface PageDocumentData {
    /**
     * title field in *page*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: page.title
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    title: prismicT.KeyTextField;
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
    /**
     * meta title field in *page*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: page.meta_title
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    meta_title: prismicT.KeyTextField;
    /**
     * meta description field in *page*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: page.meta_description
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    meta_description: prismicT.KeyTextField;
    /**
     * meta image field in *page*
     *
     * - **Field Type**: Image
     * - **Placeholder**: *None*
     * - **API ID Path**: page.meta_image
     * - **Documentation**: https://prismic.io/docs/core-concepts/image
     *
     */
    meta_image: prismicT.ImageField<null>;
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
