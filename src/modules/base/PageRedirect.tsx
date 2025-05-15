import { useLocation, Navigate } from 'react-router-dom';

const REDIRECT_MAP: Record<string, string> = {
  '': '/discovery?list=coin-radar',
  '/coin-radar': '/discovery?list=coin-radar',
  '/coin-radar/overview': '/discovery?list=coin-radar',
  '/coin-radar/social-radar': '/discovery?list=social-radar',
  '/coin-radar/technical-radar': '/discovery?list=technical-radar',
  '/coin-radar/whale-radar': '/discovery?list=whale-radar',
  '/coin-radar/network-radar': '/discovery?list=network-radar',
  '/coin-radar/alerts': '/account/alerts',
  '/coin/{slug}': '/discovery?detail=coin&slug={slug}',
  '/coin-radar/whale-radar/{nework}/{address}':
    '/discovery?detail=whale&slug={nework}/{address}',
};

const findMatchingRoute = (
  pathname: string,
  search: string,
  hash: string,
): string => {
  const normalizedPath = pathname.replace(/\/$/, '');
  let newTarget = REDIRECT_MAP[''];
  if (REDIRECT_MAP[normalizedPath]) {
    newTarget = REDIRECT_MAP[normalizedPath];
  } else {
    for (const [pattern, target] of Object.entries(REDIRECT_MAP)) {
      if (pattern.includes('{')) {
        const regex = new RegExp(
          '^' + pattern.replaceAll(/{.*?}/g, '([^/]+)') + '$',
        );
        const match = normalizedPath.match(regex);

        if (match) {
          const params = pattern.match(/{(.*?)}/g) || [];
          let result = target;

          for (const [index, param] of params.entries()) {
            result = result.replace(param, match[index + 1]);
          }

          newTarget = result;
          break;
        }
      }
    }
  }

  const returnValue = new URL(newTarget, 'https://example.org');

  const currentSearchParams = new URLSearchParams(search);
  for (const key of currentSearchParams.keys()) {
    if (!returnValue.searchParams.has(key)) {
      const values = currentSearchParams.getAll(key);
      for (const value of values) {
        returnValue.searchParams.append(key, value);
      }
    }
  }

  return `${returnValue.pathname}${returnValue.search}${hash}`;
};

export default function PageRedirect() {
  const { pathname, search, hash } = useLocation();
  const redirectTo = findMatchingRoute(pathname, search, hash);

  return <Navigate replace to={redirectTo} />;
}
