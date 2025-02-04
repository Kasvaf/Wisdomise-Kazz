/* eslint-disable unicorn/prefer-at */
import { useMemo } from 'react';

const surfaces = [
  '#090c10',
  '#131920',
  '#1d262f',
  '#28323e',
  '#333f4d',
  '#3f4b5a',
  '#4b5868',
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
