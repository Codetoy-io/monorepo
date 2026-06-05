// vite.config.js (or vite.config.ts)

import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      // Resolve @wasmsharp/core directly to the compiled _framework folder so
      // Vite sees the files as local (not node_modules), preserving relative
      // imports for WASM/DLL assets and worker URLs.
      '@wasmsharp/core': path.resolve(__dirname, './src/_framework'),
    },
  },
  optimizeDeps: {
    exclude: ['@wasmsharp/core'],
  },
  worker: {
    format: 'es',
  },
  assetsInclude: ['**/*.dll', '**/*.png', '**/*.jpg', '**/*.svg', '**/*.dat', '**/*.wasm', '**/*.pdb'],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Resource-Policy": "cross-origin"
    },
    cors: {
      origin: (origin, callback) => {
        callback(null, true);
      },
    },
  },
});
