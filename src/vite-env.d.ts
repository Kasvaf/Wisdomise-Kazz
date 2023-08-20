/// <reference types="vite/client" />

declare module '*.md' {
  // "unknown" would be more detailed depends on how you structure frontmatter
  const attributes: Record<string, string>;

  // When "Mode.React" is requested. VFC could take a generic like React.VFC<{ MyComponent: TypeOfMyComponent }>
  import type React from 'react';
  const ReactComponent: React.FC;

  // Modify below per your usage
  export { attributes, ReactComponent };
}
