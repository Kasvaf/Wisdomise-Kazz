import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { isProduction } from 'utils/version';
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

export function useHasFlag() {
  const loc = useLocation();
  const params = useParams<Record<string, string>>();
  const acc = useAccountQuery();
  const flagsObj = useMemo(
    () =>
      Object.fromEntries(acc.data?.features.map(flag => [flag, true]) ?? []),
    [acc.data?.features],
  );

  return (flag: string) => {
    if (flag[0] === '?') {
      flag = unparam(loc.pathname, params) + flag;
    }

    if (flag[0] === '/') {
      const result = Boolean(flagsObj[flag]);
      if (!result && !isProduction) {
        console.log('🚩', flag);
      }
      return result;
    }

    throw new Error('Such flag name is not in our conventions!');
  };
}

/*
All flags and Available ones for normal-user:

  [*] /investment
  [*] /investment/assets
  [*] /investment/products-catalog
  [*] /insight
  [*] /insight/signals
  [*] /insight/coins
  [*] /insight/athena
  [ ] /insight/social-radar
  [ ] /builder
  [ ] /builder/signalers
  [ ] /builder/signalers/[id]?tab=config
  [ ] /builder/signalers/[id]?tab=term
  [ ] /builder/signalers/[id]?tab=pos
  [ ] /builder/signalers/[id]?tab=perf
  [ ] /builder/signalers/[id]?tab=api
  [ ] /builder/fp
  [ ] /builder/fp/[id]?tab=build
  [ ] /builder/fp/[id]?tab=perf
  [ ] /builder/fp/[id]?tab=pos
  [ ] /builder/fp/[id]?tab=usage
  [*] /account
  [*] /account/profile
  [*] /account/billing
  [*] /account/kyc
  [*] /account/token
  [*] /account/exchange-accounts
  [*] /account/notification-center
  [*] /account/referral

  */
