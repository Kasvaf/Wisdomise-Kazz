import { useAccount, useWaitForTransaction } from 'wagmi';
import { useEffect } from 'react';
import { notification } from 'antd';
import Button from 'shared/Button';
import {
  useWriteClaimAirdrop,
  useReadAirdropIsClaimed,
} from 'modules/account/PageToken/web3/airdrop/contract';
import { type AirdropEligibility } from 'api/airdrop';
import { ReactComponent as AirdropIcon } from './icons/airdrop.svg';

export default function EligibleCheckModalContent({
  eligibility,
  onResolve,
}: {
  eligibility?: AirdropEligibility;
  onResolve: VoidFunction;
}) {
  const {
    writeAsync,
    data: claimResult,
    isLoading: claimIsLoading,
  } = useWriteClaimAirdrop();
  const { data: isClaimed } = useReadAirdropIsClaimed(eligibility?.index);
  const { address } = useAccount();
  const { data: claimReceipt, isLoading: claimReceiptIsLoading } =
    useWaitForTransaction({
      hash: claimResult?.hash,
      enabled: !!claimResult?.hash,
    });

  const claim = async () => {
    if (
      eligibility?.amount &&
      address &&
      eligibility?.index !== undefined &&
      eligibility?.proofs
    ) {
      void writeAsync({
        args: [
          BigInt(eligibility.index),
          address,
          BigInt(eligibility.amount),
          eligibility.proofs,
        ],
      }).catch(() =>
        notification.error({
          message: 'Claim Failed',
        }),
      );
    }
  };

  useEffect(() => {
    if (claimReceipt) {
      if (claimReceipt?.status === 'success') {
        notification.success({
          message: 'You claimed your tokens successfully',
        });
      } else {
        notification.error({
          message: 'Transaction reverted',
        });
      }
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
              disabled={claimIsLoading || claimReceiptIsLoading}
              loading={claimIsLoading || claimReceiptIsLoading}
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
