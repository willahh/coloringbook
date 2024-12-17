import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },

  /**
   * Build directory, use of dir "/docs" to match default github Page deploy directory
   */
  build: { outDir: './../docs' },

  /**
   * Base dir for deploy : use of github repository name.
   * Used to generate relative path e.g. <script src="/coloringbook/assets/index.js">
   * https://vitejs.fr/guide/static-deploy.html
   */
  base: '/coloringbook/',
});
