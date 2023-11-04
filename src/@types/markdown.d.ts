// https://github.com/hmsk/vite-plugin-markdown

declare module '*.md' {
  const attributes: Record<string, string>;

  import type React from 'react';
  const ReactComponent: React.FC;

  export { attributes, ReactComponent };
}
