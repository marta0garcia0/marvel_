import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { terser } from 'rollup-plugin-terser';
import cssnano from 'cssnano';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/marvel/' : '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
      plugins: [
        terser({
          compress: {
            drop_console: true,
          },
        }),
      ],
    },
    cssCodeSplit: true,
    minify: 'esbuild',
  },
  css: {
    postcss: {
      plugins: [cssnano({ preset: 'default' })],
    },
  },
}));
