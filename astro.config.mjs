import { defineConfig } from "astro/config";
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  // Enable React to support React JSX components.
  site: "https://nkd.red",
  compressHTML: true,
  integrations: [react(), tailwind()],
});
