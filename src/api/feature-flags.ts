import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { isDebugMode, isLocal } from 'utils/version';
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
  '/coin-radar',
  '/coin-radar/overview',
  '/coin-radar/social-radar?side-suggestion',
  '/coin-radar/social-radar',
  '/coin-radar/technical-radar',
  '/coin-radar/alerts?price',
  '/coin-radar/alerts?coinradar',
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
      if (!result && (isDebugMode || isLocal)) {
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
