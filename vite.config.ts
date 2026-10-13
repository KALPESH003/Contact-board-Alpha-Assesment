/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

<<<<<<< HEAD
// `base: './'` keeps the build portable (static hosting under any sub-path).
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
export default defineConfig({
  base: './',
  plugins: [react()],
  test: { environment: 'node' },
});
