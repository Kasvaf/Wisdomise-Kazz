import { AUTO_TRADER_MINI_APP_BASE } from 'config/constants';
import { isMiniApp } from 'utils/version';
import { useReferralStatusQuery } from 'api';

export function useReferral() {
  const { data: referral } = useReferralStatusQuery();

  const myOrigin = window.location.origin;
  const webReferralLink = `${myOrigin}/ref/${referral?.referral_code ?? ''}`;
  const tgReferralLink = `${AUTO_TRADER_MINI_APP_BASE}?startapp=referrer_${
    referral?.referral_code ?? ''
  }`;
  return isMiniApp ? tgReferralLink : webReferralLink;
}
