import { useLocation, Navigate } from 'react-router-dom';
import { LISTS } from 'modules/discovery/constants';
import { createDiscoverySearchParams } from 'modules/discovery/useDiscoveryRouteMeta';

const REDIRECT_MAP: Record<string, string> = {
  // Coin Radar
  '': `/discovery?${createDiscoverySearchParams({}).toString()}`,
  '/coin-radar': `/discovery?${createDiscoverySearchParams({
    list: 'coin-radar',
  }).toString()}`,
  '/coin-radar/overview': `/discovery?${createDiscoverySearchParams({
    list: 'coin-radar',
  }).toString()}`,
  // Social Radar
  '/coin-radar/social-radar': `/discovery?${createDiscoverySearchParams({
    list: 'social-radar',
  }).toString()}`,
  // Social Radar
  '/coin-radar/technical-radar': `/discovery?${createDiscoverySearchParams({
    list: 'technical-radar',
  }).toString()}`,
  // Whale Radar
  '/coin-radar/whale-radar': `/discovery?${createDiscoverySearchParams({
    list: 'whale-radar',
  }).toString()}`,
  // Network Radar
  '/coin-radar/network-radar': `/discovery?${createDiscoverySearchParams({
    list: 'network-radar',
  }).toString()}`,
  // Alerts
  '/coin-radar/alerts': '/account/alerts',
  // Whale Details
  '/whale/{nework}/{address}': `/discovery?${createDiscoverySearchParams({
    detail: 'whale',
    slug: '{nework}/{address}',
  }).toString()}`,
  '/coin-radar/whale-radar/{nework}/{address}': `/discovery?${createDiscoverySearchParams(
    {
      detail: 'whale',
      slug: '{nework}/{address}',
    },
  ).toString()}`,
  // Coin Details
  '/token/{nework}/{address}': `/discovery?${createDiscoverySearchParams({
    detail: 'coin',
    slug: '{nework}/{address}',
  }).toString()}`,
  '/token/{nework}': `/discovery?${createDiscoverySearchParams({
    detail: 'coin',
    slug: '{network}/',
  }).toString()}`,
  '/coin/{slug}': `/discovery?${createDiscoverySearchParams({
    detail: 'coin',
    slug: '{slug}',
  }).toString()}`,

  ...Object.fromEntries(
    Object.keys(LISTS).map(list => [
      `/discovery/${list}`,
      `/discovery?${createDiscoverySearchParams({
        list: list as never,
      }).toString()}`,
    ]),
  ),
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
