import { useLocation, Navigate } from 'react-router-dom';

const REDIRECT_MAP: Record<string, string> = {
  '': '/discovery?list=coin-radar',
  '/coin-radar': '/discovery?list=coin-radar',
  '/coin-radar/overview': '/discovery?list=coin-radar',
  '/coin-radar/social-radar': '/discovery?list=social-radar',
  '/coin-radar/technical-radar': '/discovery?list=technical-radar',
  '/coin-radar/whale-radar': '/discovery?list=whale-radar',
  '/coin-radar/network-radar': '/discovery?list=network-radar',
  '/coin/{slug}': '/discovery?detail=coin&slug={slug}',
  '/coin-radar/whale-radar/{nework}/{address}':
    '/discovery?detail=whale&slug={nework}/{address}',
};

const findMatchingRoute = (pathname: string) => {
  // Remove trailing slash for consistency
  const normalizedPath = pathname.replace(/\/$/, '');

  // Try exact match first
  if (REDIRECT_MAP[normalizedPath]) {
    return REDIRECT_MAP[normalizedPath];
  }

  // Try pattern matching
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

        return result;
      }
    }
  }

  // Default redirect
  return REDIRECT_MAP[''];
};

export default function PageRedirect() {
  const { pathname } = useLocation();
  const redirectTo = findMatchingRoute(pathname);

  return <Navigate replace to={redirectTo} />;
}
