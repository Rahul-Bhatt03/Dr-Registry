import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Only use 'external' if necessary. Temporarily remove this to test.
      // external: ['@mui/material', '@mui/icons-material']
    }
  }
});
