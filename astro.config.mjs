import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkToc from 'remark-toc';


// https://astro.build/config
export default defineConfig({
  // Enable React to support React JSX components.
  site: "https://nkd.red",
  compressHTML: true,
  integrations: [react(), tailwind(), mdx()],
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkToc,
    ],
    rehypePlugins: [
      [rehypeKatex, {
        macros: {
          '\\d': '\\mathrm{d}',
          '\\E': '\\mathbb{E}',
          '\\C': '\\mathbb{C}',
          '\\R': '\\mathbb{R}',
          '\\N': '\\mathbb{N}',
          '\\Q': '\\mathbb{Q}',
          '\\bigO': '\\mathcal{O}',
          '\\abs': '|#1|',
          '\\set': '\\{ #1 \\}',
          '\\indep': "{\\perp\\mkern-9.5mu\\perp}",
          '\\nindep': "{\\not\\!\\perp\\!\\!\\!\\perp}",
          "\\latex": "\\LaTeX",
          "\\katex": "\\KaTeX",
        },
      }]
    ]
  }

});