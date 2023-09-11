import { clsx } from 'clsx';
import { useIsVerified } from 'api/kyc';
import Badge from 'modules/shared/Badge';
import useConfirm from 'shared/useConfirm';

const Line = () => (
  <div className="mx-4 mb-2.5 flex-1 border-b border-white/10" />
);

const badgeByCalendlyStatus = {
  UNVERIFIED: <Badge label="Unverified" color="white" />,
  SET_CALENDLY_MEETING: <Badge label="Pending Meeting" color="blue" />,
  VERIFIED: <Badge label="Verified" color="green" />,
  UNKNOWN: <Badge label="loading" color="white" />,
};

const badgeBySumsubStatus = {
  UNVERIFIED: <Badge label="Unverified" color="white" />,
  PENDING: <Badge label="Pending" color="blue" />,
  VERIFIED: <Badge label="Verified" color="green" />,
  REJECTED: <Badge label="Rejected" color="red" />,
};

const VerifyBadge: React.FC<{ done: boolean }> = ({ done }) =>
  done ? (
    <Badge label="Verified" color="green" className="w-[72px]" />
  ) : (
    <Badge label="Unverified" color="white" className="w-[72px]" />
  );

const useModalVerification = () => {
  const isVerified = useIsVerified();

  return useConfirm({
    icon: null,
    yesTitle: 'Let’s Verify Now!',
    noTitle: '',
    message: (
      <>
        <h1 className="mb-10 text-center text-base font-semibold">
          KYC Status
        </h1>

        <div className="mb-10 rounded-3xl bg-black/10 p-3">
          <div className="mb-2 flex">
            <div className={clsx(isVerified.identified && 'text-white/60')}>
              Identification
            </div>
            <Line />
            {badgeBySumsubStatus[isVerified.identified || 'UNVERIFIED']}
          </div>

          <div className="mb-2 flex">
            <div>Verification</div>
            <Line />
            {badgeByCalendlyStatus[isVerified.verified || 'UNVERIFIED']}
          </div>

          <div className="flex">
            <div>Wallet Verification</div>
            <Line />
            <VerifyBadge done={isVerified.addedWallet} />
          </div>
        </div>

        <div className="text-center text-white/60">
          Complete your <span className="text-white">Identification</span>,{' '}
          <span className="text-white">Verification</span> and{' '}
          <span className="text-white">Verify At Least One Wallet Address</span>{' '}
          to access all features and enjoy a seamless experience on our
          platform.
        </div>
      </>
    ),
  });
};
export default useModalVerification;
