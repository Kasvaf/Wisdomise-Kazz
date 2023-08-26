import linaria from '@linaria/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { createHtmlPlugin } from 'vite-plugin-html';
import { Mode, plugin as mdPlugin } from 'vite-plugin-markdown';

// https://vitejs.dev/config/
export default defineConfig(config => ({
  plugins: [
    mdPlugin({
      mode: [Mode.REACT],
    }),
    react(),
    svgr(),
    linaria({
      include: ['**/*.{ts,tsx}'],
      babelOptions: {
        presets: ['@babel/preset-typescript', '@babel/preset-react'],
      },
    }),
    createHtmlPlugin({
      minify: config.mode === 'production',
      entry: '/src/main.tsx',
      inject: {
        data: {
          env: config.mode,
        },
      },
    }),
  ],
  resolve: {
    alias: [
      { find: 'config', replacement: '/src/config' },
      { find: 'utils', replacement: '/src/utils' },
      { find: 'api', replacement: '/src/api' },
      { find: 'old-api', replacement: '/src/old-api' },
      { find: 'modules', replacement: '/src/modules' },
      { find: 'shared', replacement: '/src/modules/shared' },
      { find: 'assets', replacement: '/src/assets' },
    ],
  },
  esbuild: {
    drop: config.mode === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    sourcemap: config.mode !== 'production',
  },
}));
