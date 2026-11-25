import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { publicProducts } from './src/public-products.js';
import { productCardHtml } from './src/catalog-card.js';

// Writes the catalog cards into index.html at build time, so the catalog is in
// the static HTML for search engines and first paint. JS then only filters it.
function staticCatalog() {
  return {
    name: 'zj-static-catalog',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (!ctx.filename.endsWith('index.html') || !html.includes('<!--STATIC_CATALOG-->')) return html;
        const cards = publicProducts.map((p) => productCardHtml(p, `./assets/${new URL(p.image).pathname.split('/assets/').pop()}`)).join('\n');
        return html.replace('<!--STATIC_CATALOG-->', cards).replace('<!--CATALOG_COUNT-->', `${publicProducts.length} models`);
      }
    }
  };
}

export default defineConfig({
  plugins: [staticCatalog()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        product: resolve(process.cwd(), 'product.html'),
        social: resolve(process.cwd(), 'social.html'),
        client: resolve(process.cwd(), 'client.html'),
        admin: resolve(process.cwd(), 'admin.html'),
        coverage: resolve(process.cwd(), 'coverage.html'),
        simpleGuide: resolve(process.cwd(), 'simple-guide.html')
      }
    }
  }
});
