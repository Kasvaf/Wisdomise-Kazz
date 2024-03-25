import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAccountQuery } from './account';

// hasFlag('?xyz') -> [current-pathname]?xyz
// hasFlag('/xyz/abc') -> '/xyz/abc' is used as is

export function useHasFlag() {
  const loc = useLocation();
  const acc = useAccountQuery();
  const flagsObj = useMemo(
    () =>
      Object.fromEntries(acc.data?.features.map(flag => [flag, true]) ?? []),
    [acc.data?.features],
  );

  return (flag: string) => {
    if (flag[0] === '?') {
      flag = loc.pathname + flag;
    }

    if (flag[0] === '/') {
      return Boolean(flagsObj[flag]);
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
  [ ] /builder/fp
  [*] /account
  [*] /account/profile
  [*] /account/billing
  [*] /account/kyc
  [*] /account/token
  [*] /account/exchange-accounts
  [*] /account/notification-center
  [*] /account/referral

  */
