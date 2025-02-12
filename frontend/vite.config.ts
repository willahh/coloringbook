/**
 * https://tailwindcss.com/docs/installation/using-vite
 */
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    plugins: [react(), svgr({}), tailwindcss()],
    envDir: './env',
    publicDir: './public',
    build: {
      outDir: './dist',
      copyPublicDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Si c'est un fichier CSS spécifique pour un thème, le placer dans un chunk séparé
            if (id.includes('main.light.css') || id.includes('main.dark.css')) {
              const parts = id.split('/');
              const lastPart = parts.pop();
              if (lastPart) {
                return lastPart.split('.')[1];
              }
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@components': path.resolve(__dirname, './src/common/components'),
        '@services': path.resolve(__dirname, './src/services'),
        '@utils': path.resolve(__dirname, './src/common/utils'),
        '@apptypes': path.resolve(__dirname, './src/common/types'),
        '@shared': path.resolve(__dirname, './src/common/shared'),
      },
    },
  };
});
