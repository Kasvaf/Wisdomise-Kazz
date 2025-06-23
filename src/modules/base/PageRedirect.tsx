import { useLocation, Navigate } from 'react-router-dom';
import { LISTS } from 'modules/discovery/constants';
import { groupDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';

const REDIRECT_MAP: Record<string, string> = {
  // Coin Radar
  '': `/discovery?ui=${groupDiscoveryRouteMeta({})}`,
  '/coin-radar': `/discovery?ui=${groupDiscoveryRouteMeta({
    list: 'coin-radar',
  })}`,
  '/coin-radar/overview': `/discovery?ui=${groupDiscoveryRouteMeta({
    list: 'coin-radar',
  })}`,
  // Social Radar
  '/coin-radar/social-radar': `/discovery?ui=${groupDiscoveryRouteMeta({
    list: 'social-radar',
  })}`,
  // Social Radar
  '/coin-radar/technical-radar': `/discovery?ui=${groupDiscoveryRouteMeta({
    list: 'technical-radar',
  })}`,
  // Whale Radar
  '/coin-radar/whale-radar': `/discovery?ui=${groupDiscoveryRouteMeta({
    list: 'whale-radar',
  })}`,
  // Network Radar
  '/coin-radar/network-radar': `/discovery?ui=${groupDiscoveryRouteMeta({
    list: 'network-radar',
  })}`,
  // Alerts
  '/coin-radar/alerts': '/account/alerts',
  // Whale Details
  '/whale/{nework}/{address}': `/discovery?ui=${groupDiscoveryRouteMeta({
    detail: 'whale',
  })}&slug={nework}/{address}`,
  '/coin-radar/whale-radar/{nework}/{address}': `/discovery?ui=${groupDiscoveryRouteMeta(
    {
      detail: 'whale',
    },
  )}&slug={nework}/{address}`,
  // Coin Details
  '/token/{nework}/{address}': `/discovery?ui=${groupDiscoveryRouteMeta({
    detail: 'coin',
  })}&slug={nework}/{address}`,
  '/token/{nework}': `/discovery?ui=${groupDiscoveryRouteMeta({
    detail: 'coin',
  })}&slug={nework}/`,
  '/coin/{slug}': `/discovery?ui=${groupDiscoveryRouteMeta({
    detail: 'coin',
  })}&slug={slug}`,

  ...Object.fromEntries(
    Object.keys(LISTS).map(list => [
      `/discovery/${list}`,
      `/discovery?ui=${groupDiscoveryRouteMeta({
        list: list as never,
      })}`,
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
