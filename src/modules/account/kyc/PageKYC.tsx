import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bxInfoCircle } from 'boxicons-quasar';
import { useSumsubVerified, useAccountQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import Banner from 'shared/Banner';
import Card from 'shared/Card';
import Badge from './Badge';
import { ReactComponent as IdentificationSvg } from './identification.svg';

const useBadgeBySumsubStatus = () => {
  const { t } = useTranslation('kyc');
  return {
    UNVERIFIED: <Badge text={t('badges.unverified')} color="white" />,
    PENDING: <Badge text={t('badges.pending')} color="blue" />,
    VERIFIED: <Badge text={t('badges.verified')} color="green" />,
    REJECTED: <Badge text={t('badges.rejected')} color="red" />,
  };
};

export default function PageKYC() {
  const { t } = useTranslation('kyc');
  const sumsubVerified = useSumsubVerified();
  const account = useAccountQuery();
  const badgeBySumsubStatus = useBadgeBySumsubStatus();

  const loading = sumsubVerified.isLoading || account.isLoading;
  return (
    <PageWrapper loading={loading}>
      <h1 className="mb-8 text-xl font-semibold">KYC</h1>

      <Banner style="warn" icon={bxInfoCircle} className="mb-3">
        <div className="mobile:flex mobile:flex-col mobile:gap-3 mobile:text-xs">
          <span className="mr-1 font-semibold">
            {t('wisdomise-only.title')}
          </span>
          <span>{t('wisdomise-only.subtitle')}</span>
        </div>
      </Banner>

      <div className="flex flex-col gap-6">
        <Card className="w-full !p-6">
          <h2 className="font-semibold">{t('identification.title')}</h2>

          <div className="flex items-start justify-between gap-4">
            <div className="mt-8 text-xs text-white/60">
              {t('identification.description')}
            </div>
            <div>
              <IdentificationSvg className="h-[100px] w-[100px] saturate-0" />
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-3 md:flex-row">
            <div className="flex flex-col items-start">
              {badgeBySumsubStatus[sumsubVerified.data || 'UNVERIFIED']}
            </div>
            {sumsubVerified.data !== 'VERIFIED' && (
              <NavLink
                to="/account/kyc/sumsub"
                className="rounded-xl bg-white px-5 py-3 text-center text-[14px] text-black"
              >
                {t('identification.btn-start-sumsub')}
              </NavLink>
            )}
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
