import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
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
