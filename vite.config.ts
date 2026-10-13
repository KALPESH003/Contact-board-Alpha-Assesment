/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps the build portable (static hosting under any sub-path).
export default defineConfig({
  base: './',
  plugins: [react()],
  test: { environment: 'node' },
});
