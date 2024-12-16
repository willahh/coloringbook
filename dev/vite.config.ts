import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  /**
   * Build directory, use of dir "/docs" to match default github Page deploy directory
   */
  build: { outDir : "./../docs"},

  /**
   * Base dir for deploy : use of github repository name.
   * Used to generate relative path e.g. <script src="/coloringbook/assets/index.js">
   * https://vitejs.fr/guide/static-deploy.html
   */
  base: '/coloringbook/'
});
