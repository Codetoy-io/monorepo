import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: ["bogusorigin", "sub.bogusorigin"],
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Resource-Policy": "cross-origin"
    },
    cors: {
      origin: (origin, callback) => {
        // Allow null origin (sandboxed iframes) in dev
        callback(null, true);
      },
    },
  }
});