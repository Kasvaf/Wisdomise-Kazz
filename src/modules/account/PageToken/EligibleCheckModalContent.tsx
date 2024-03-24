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
    <div className="flex min-h-[16rem] flex-col items-center gap-4 text-center">
      {eligibility ? (
        <>
          <AirdropIcon />
          <div>
            You are <span className="text-green-400">eligible</span> to claim
          </div>
          <div className="text-3xl italic">
            <strong>{((eligibility?.amount ?? 0) / 10 ** 6).toFixed(2)}</strong>{' '}
            <strong>WSDM</strong>
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
              Claim Now
            </Button>
          )}
        </>
      ) : (
        <>
          <AirdropIcon className="hue-rotate-[200deg]" />
          <p className="mb-4">
            You are <span className="text-red-400">not eligible</span> for this
            round of WSDM Airdrop
          </p>
          <Button variant="alternative" onClick={() => onResolve()}>
            Close
          </Button>
        </>
      )}
    </div>
  );
}
