import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // root: '.', // default, no need to specify if root is project root
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'public/index.html', // point to your HTML file
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
});
