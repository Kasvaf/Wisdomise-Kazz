/* eslint-disable unicorn/prefer-at */
import { useMemo } from 'react';

const surfaces = [
  'var(--color-v1-surface-l0)',
  'var(--color-v1-surface-l1)',
  'var(--color-v1-surface-l2)',
  'var(--color-v1-surface-l3)',
  'var(--color-v1-surface-l4)',
  'var(--color-v1-surface-l5)',
  'var(--color-v1-surface-l6)',
];

export type Surface = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const useSurface = (surface: Surface) => {
  return useMemo(
    () => ({
      current: surfaces[surface] ?? surfaces[0],
      next: surfaces[surface + 1] ?? surfaces[surfaces.length - 1],
      later: surfaces[surface + 2] ?? surfaces[surfaces.length - 1],
      prev: surfaces[surface - 1] ?? surfaces[surfaces.length - 1],
      earlier: surfaces[surface - 2] ?? surfaces[surfaces.length - 1],
    }),
    [surface],
  );
};
