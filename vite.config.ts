import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import i18nextLoader from 'vite-plugin-i18next-loader';
import { Mode, plugin as mdPlugin } from 'vite-plugin-markdown';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(config => ({
  build: {
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true, // transforms CJS in ESM
    },
  },
  base: `/${process.env.VITE_BRANCH || ''}`,
  plugins: [
    tailwindcss(),
    i18nextLoader({
      paths: ['./src/i18n'],
      namespaceResolution: 'relativePath',
    }),
    mdPlugin({
      mode: [Mode.REACT],
    }),
    react(),
    svgr(),
    createHtmlPlugin({
      minify: config.mode === 'production',
      entry: '/src/main.tsx',
      inject: {
        data: {
          env: config.mode,
        },
      },
    }),
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'sentry',
      project: 'dashboard',
      url: 'https://sentry.wisdomise.com/',
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
      { find: 'styles', replacement: '/src/styles' },
      { find: 'assets', replacement: '/src/assets' },
      { find: 'buffer', replacement: 'buffer' },
    ],
  },
  esbuild: {
    drop: config.mode === 'production' ? ['debugger'] : [],
  },
  server: {
    proxy: Object.fromEntries(
      ['temple', 'account-panel', 'chatapp'].map(name => [
        `/${name}-proxy`,
        {
          target: `https://stage-${name}.goatx.trade`,
          changeOrigin: true,
          secure: false,
          rewrite: p => p.replace(`/${name}-proxy`, ''),
        },
      ]),
    ),
    cors: false,
  },
  define: {
    'process.env': {},
  },
}));
