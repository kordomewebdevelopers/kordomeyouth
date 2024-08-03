import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    alias: {
      $comps: "src/comps",
      $styles: "src/styles",
      $store: "src/store",
      $helpers: "src/helpers",
      $db: "src/db",
      $types: "src/types",
    },
  },
};

export default config;
