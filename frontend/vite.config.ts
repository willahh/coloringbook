import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateEnvJson(envFilePath: string): string {
  try {
    const envFileContent = fs.readFileSync(envFilePath, 'utf-8');
    const envObject: { [key: string]: string } = envFileContent
      .split('\n')
      .reduce((acc: { [key: string]: string }, line) => {
        const [key, value] = line.split('=');
        if (key && value) {
          const k = key.trim();
          acc[k] = value.trim();
        }
        return acc;
      }, {});
    return JSON.stringify(envObject);
  } catch (error) {
    console.error(
      `Error reading or parsing env file at ${envFilePath}:`,
      error
    );
    return '{}';
  }
}

export default defineConfig(({ mode }) => {
  const envFilePath = path.resolve(__dirname, `env/${mode}.env`);
  const envJson = generateEnvJson(envFilePath);

  return {
    plugins: [react(), svgr({})],
    define: {
      'process.env': envJson,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@components': path.resolve(__dirname, './src/components'),
        '@shared': path.resolve(__dirname, './src/shared'),
      },
    },
    build: { outDir: './dist' },
  };
});
