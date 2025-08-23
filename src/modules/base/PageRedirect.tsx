import { Navigate, useLocation } from 'react-router-dom';

const REDIRECT_MAP: Record<string, string> = {
  // Home
  '': `/trench`,
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
          `^${pattern.replaceAll(/{.*?}/g, '([^/]+)')}$`,
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
  console.log(pathname, search, hash, redirectTo);

  return <Navigate replace to={redirectTo} />;
}
