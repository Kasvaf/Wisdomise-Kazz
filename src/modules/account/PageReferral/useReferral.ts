import { TELEGRAM_BOT_BASE_URL } from 'config/constants';
import { isMiniApp } from 'utils/version';
import { useReferralStatusQuery } from 'api';

export function useReferral() {
  const { data: referral } = useReferralStatusQuery();

  const myOrigin = window.location.origin;
  const webReferralLink = `${myOrigin}/ref/${referral?.referral_code ?? ''}`;
  const tgReferralLink = `${TELEGRAM_BOT_BASE_URL}?startapp=referrer_${
    referral?.referral_code ?? ''
  }`;
  return isMiniApp ? tgReferralLink : webReferralLink;
}
