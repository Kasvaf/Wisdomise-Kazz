import { clsx } from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import { useIsVerified } from 'api/kyc';
import Badge from 'modules/shared/Badge';
import useConfirm from 'shared/useConfirm';

const Line = () => (
  <div className="mx-4 mb-2.5 flex-1 border-b border-white/10" />
);

const useModalVerification = () => {
  const { t } = useTranslation('kyc');
  const isVerified = useIsVerified();

  const badgeByCalendlyStatus = {
    UNVERIFIED: (
      <Badge
        className="w-[72px]"
        label={t('badges.unverified')}
        color="white"
      />
    ),
    SET_CALENDLY_MEETING: (
      <Badge
        className="w-[120px]"
        label={t('badges.pending-meeting')}
        color="blue"
      />
    ),
    VERIFIED: (
      <Badge className="w-[72px]" label={t('badges.verified')} color="green" />
    ),
    UNKNOWN: (
      <Badge className="w-[72px]" label={t('badges.unknown')} color="white" />
    ),
  };

  const badgeBySumsubStatus = {
    UNVERIFIED: (
      <Badge
        className="w-[72px]"
        label={t('badges.unverified')}
        color="white"
      />
    ),
    PENDING: (
      <Badge className="w-[72px]" label={t('badges.pending')} color="blue" />
    ),
    VERIFIED: (
      <Badge className="w-[72px]" label={t('badges.verified')} color="green" />
    ),
    REJECTED: (
      <Badge className="w-[72px]" label={t('badges.rejected')} color="red" />
    ),
  };

  const VerifyBadge: React.FC<{ done: boolean }> = ({ done }) =>
    done ? (
      <Badge label={t('badges.verified')} color="green" className="w-[72px]" />
    ) : (
      <Badge
        label={t('badges.unverified')}
        color="white"
        className="w-[72px]"
      />
    );

  return useConfirm({
    icon: null,
    yesTitle: 'Let’s Verify Now!',
    noTitle: '',
    message: (
      <>
        <h1 className="mb-10 text-center text-base font-semibold">
          {t('modal-kyc.title')}
        </h1>

        <div className="mb-10 rounded-3xl bg-black/10 p-3">
          <div className="mb-2 flex">
            <div
              className={clsx(
                isVerified.identified === 'VERIFIED' && 'text-white/60',
              )}
            >
              {t('identification.title')}
            </div>
            <Line />
            {badgeBySumsubStatus[isVerified.identified || 'UNVERIFIED']}
          </div>

          <div className="mb-2 flex">
            <div
              className={clsx(
                isVerified.verified === 'VERIFIED' && 'text-white/60',
              )}
            >
              {t('verification.title')}
            </div>
            <Line />
            {badgeByCalendlyStatus[isVerified.verified || 'UNVERIFIED']}
          </div>

          <div className="flex">
            <div className={clsx(isVerified.addedWallet && 'text-white/60')}>
              {t('wallet.title')}
            </div>
            <Line />
            <VerifyBadge done={isVerified.addedWallet} />
          </div>
        </div>

        <div className="text-center text-white/60">
          <Trans i18nKey="modal-kyc.footer" ns="kyc">
            Complete your <span className="text-white">Identification</span>,{' '}
            <span className="text-white">Verification</span>, and{' '}
            <span className="text-white">
              Verify at least one wallet address
            </span>{' '}
            to access all features and enjoy a seamless experience on our
            platform.
          </Trans>
        </div>
      </>
    ),
  });
};
export default useModalVerification;
