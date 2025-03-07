/**
 * https://tailwindcss.com/docs/installation/using-vite
 */
// import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

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
    // server: {
    //   host: '0.0.0.0', // Permet l'accès via IP locale (192.168.1.67)
    //   port: 5173,
    //   https: {
    //     cert: fs.readFileSync(
    //       path.resolve(__dirname, '../documents/cert/192.168.1.67.pem')
    //     ),
    //     key: fs.readFileSync(
    //       path.resolve(__dirname, '../documents/cert/192.168.1.67-key.pem')
    //     ),
    //   },
    // },
  };
});
