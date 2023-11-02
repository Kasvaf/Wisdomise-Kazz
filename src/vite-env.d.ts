/* eslint-disable @typescript-eslint/triple-slash-reference */

/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// https://github.com/hmsk/vite-plugin-markdown
declare module '*.md' {
  const attributes: Record<string, string>;

  import type React from 'react';
  const ReactComponent: React.FC;

  export { attributes, ReactComponent };
}

declare module 'virtual:i18next-loader';

declare module 'i18next' {
  interface CustomTypeOptions {
    allowObjectInHTMLChildren: true;
  }
}
