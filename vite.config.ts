import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  root: resolve(__dirname),
  plugins: [react()],
  server: {
    port: 5173,
    host: '127.0.0.1'
  }
});
