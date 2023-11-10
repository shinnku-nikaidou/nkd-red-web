export interface IFrontmatter {
  title: string;
  description: string;
  pubDate: string;
  imgSrc: string;
  imgAlt: string;
  draft: boolean;
}

export type Page<T> = import('astro').Page<T>;
export type MarkdownInstance<T extends Record<string, any>> = import('astro').MarkdownInstance<T>;

export type FrontmatterPage = Page<MarkdownInstance<IFrontmatter>>;
