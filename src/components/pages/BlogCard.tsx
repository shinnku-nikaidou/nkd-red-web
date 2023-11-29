import type { MarkdownInstance } from "astro";
import { format } from "date-fns";

import type { IFrontmatter } from "../../types/IFrontMatter";

const BlogCard = ({
  instance,
}: {
  instance: MarkdownInstance<IFrontmatter>;
}) => (
  <a className="hover:translate-y-1" href={instance.url}>
    <div className="overflow-hidden rounded-md">
      <div className="aspect-w-3 aspect-h-2">
        <img
          className="h-full w-full object-cover object-center"
          src={instance.frontmatter.imgSrc}
          alt={instance.frontmatter.imgAlt}
          loading="lazy"
        />
      </div>

      <div className="px-3 pt-4 pb-6 text-center">
        <h2 className="text-xl font-semibold">{instance.frontmatter.title}</h2>

        <div className="mt-1 text-xs text-gray-500">
          {format(new Date(instance.frontmatter.pubDate), "LLL d, yyyy")}
        </div>

        <div className="mt-2 text-sm">{instance.frontmatter.description}</div>
      </div>
    </div>
  </a>
);

export { BlogCard };
