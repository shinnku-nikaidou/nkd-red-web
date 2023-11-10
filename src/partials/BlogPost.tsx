import type { ReactNode } from "react";

import { AppConfig } from "@/utils/AppConfig";
import type { IFrontmatter } from "@/types/IFrontMatter";
import { Section } from "@/components/Section";
import { PostHeader } from "@/components/PostHeader";
import { PostContent } from "@/components/PostContent";

type IBlogPostProps = {
  frontmatter: IFrontmatter;
  children: ReactNode;
};

const BlogPost = (props: IBlogPostProps) => (
  <Section>
    <PostHeader content={props.frontmatter} author={AppConfig.author} />

    <PostContent content={props.frontmatter}>{props.children}</PostContent>
  </Section>
);

export { BlogPost };
