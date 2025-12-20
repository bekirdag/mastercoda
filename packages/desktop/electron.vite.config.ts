import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  main: {
    entry: 'src/main/main.ts',
    build: {
      outDir: 'dist/main'
    }
  },
  preload: {
    build: {
      outDir: 'dist/preload',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/preload.ts')
        }
      }
    }
  },
  renderer: {
    root: 'src/renderer',
    build: {
      outDir: '../../dist/renderer',
      emptyOutDir: true
    },
    server: {
      fs: {
        allow: [resolve(__dirname, 'src')]
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer'),
        '@shared': resolve(__dirname, 'src/shared')
      }
    },
    plugins: [react()]
  }
});
