import { useEffect } from 'react';
import { notification } from 'antd';
import Button from 'shared/Button';
import { type AirdropEligibility } from 'api/airdrop';
import { useAirdrop } from 'modules/account/PageToken/web3/airdrop/useAirdrop';
import { ReactComponent as AirdropIcon } from './icons/airdrop.svg';

export default function EligibleCheckModalContent({
  eligibility,
  onResolve,
}: {
  eligibility?: AirdropEligibility;
  onResolve: VoidFunction;
}) {
  const { isLoading, isClaimed, claim, claimReceipt } = useAirdrop(eligibility);

  useEffect(() => {
    if (claimReceipt?.status === 'success') {
      notification.success({
        message: 'You claimed your tokens successfully',
      });
      onResolve();
    }
  }, [claimReceipt, onResolve]);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {eligibility ? (
        <>
          <AirdropIcon />
          <div>You are eligible</div>
          <div className="text-3xl italic">
            <strong>{((eligibility?.amount ?? 0) / 10 ** 6).toFixed(2)}</strong>{' '}
            <strong className="text-green-400">WSDM</strong>
          </div>
          {isClaimed === undefined ? null : isClaimed ? (
            <p className="text-amber-400">You already claimed your tokens.</p>
          ) : (
            <Button
              variant="primary-purple"
              disabled={isLoading}
              loading={isLoading}
              onClick={claim}
            >
              Claim WSDM
            </Button>
          )}
        </>
      ) : (
        <p className="text-white/60">You are not eligible for airdrop</p>
      )}
    </div>
  );
}
