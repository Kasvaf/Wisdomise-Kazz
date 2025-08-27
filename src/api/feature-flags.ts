import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { isDebugMode } from 'utils/version';
import { useAccountQuery } from './account';

// hasFlag('?xyz') -> [current-pathname]?xyz
// hasFlag('/xyz/abc') -> '/xyz/abc' is used as is

function unparam(
  path: string,
  params: Readonly<Partial<Record<string, string>>>,
) {
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      path = path.replace(value, `[${key}]`);
    }
  }
  return path;
}

const defaultFlags = [
  '/quick-swap',
  '/[list]',
  '/[detail]/[slug1]',
  '/[detail]/[slug1]/[slug2]',
  '/[detail]/[slug1]/[slug2]/[slug3]',
  '/bluechips',
  '/trench',
  '/account/alerts',
  '/menu',
];

export function useHasFlag() {
  const loc = useLocation();
  const acc = useAccountQuery();
  const params = useParams<Record<string, string>>();
  const flagsObj = useMemo(
    () =>
      Object.fromEntries(
        (acc.data?.features ?? defaultFlags).map(flag => [flag, true]) ?? [],
      ),
    [acc.data?.features],
  );

  return (flag: string) => {
    if (flag[0] === '?') {
      flag = unparam(loc.pathname, params) + (flag.length > 1 ? flag : '');
    }

    if (flag[0] === '/') {
      const result = flag === '/' || Boolean(flagsObj[flag]);
      if (!result && isDebugMode) {
        if (flagsObj['//all']) {
          console.log('🚩', flag, '(enabled by //all)');
        } else {
          console.log('🚩', flag);
        }
      }

      return result || flagsObj['//all'];
    }

    throw new Error('Such flag name is not in our conventions!');
  };
}
