import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    // Fonts stay separate files so the prerendered pages can preload them.
    assetsInlineLimit: (file) => (file.endsWith('.woff2') ? false : undefined),
  },
});
