import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { loadEnv } from 'vite';
const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), 'PUBLIC_');
const site = env.PUBLIC_SITE_URL || 'https://purr.example';
export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !/\/(404|download|github|license)\//.test(page) }),
  ],
  markdown: { shikiConfig: { theme: 'github-dark-default', wrap: true } },
  devToolbar: { enabled: false },
});
