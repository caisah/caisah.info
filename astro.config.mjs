import { copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    site: 'https://caisah.info',
    integrations: [
        mdx(),
        sitemap(),
        {
            name: 'conventional-sitemap-url',
            hooks: {
                'astro:build:done': async ({ dir, logger }) => {
                    const outputDirectory = fileURLToPath(dir);
                    await copyFile(join(outputDirectory, 'sitemap-index.xml'), join(outputDirectory, 'sitemap.xml'));
                    logger.info('`sitemap.xml` copied from `sitemap-index.xml`');
                }
            }
        }
    ],
    vite: {
        plugins: [tailwindcss()]
    }
});
