import { useAccount, useWaitForTransaction } from 'wagmi';
import { notification } from 'antd';
import { useEffect } from 'react';
import {
  useReadAirdropIsClaimed,
  useWriteClaimAirdrop,
} from 'modules/account/PageToken/web3/airdrop/contract';
import type { AirdropEligibility } from 'api/airdrop';

export function useAirdrop(eligibility?: AirdropEligibility) {
  const {
    writeAsync: _,
    data: claimResult,
    isLoading,
  } = useWriteClaimAirdrop();
  const { data: isClaimed, refetch } = useReadAirdropIsClaimed(
    eligibility?.index,
  );
  const { address: _a } = useAccount();
  const { data: claimReceipt, isLoading: isWaiting } = useWaitForTransaction({
    hash: claimResult?.hash,
    enabled: !!claimResult?.hash,
  });

  const claim = async () => {
    // if (
    //   eligibility?.amount &&
    //   address &&
    //   eligibility?.index !== undefined &&
    //   eligibility?.proofs
    // ) {
    //   void writeAsync({
    //     args: [
    //       BigInt(eligibility.index),
    //       address,
    //       BigInt(eligibility.amount),
    //       eligibility.proofs,
    //     ],
    //   }).catch(error =>
    //     notification.error({
    //       message: extractWagmiErrorMessage(error.message),
    //     }),
    //   );
    // }
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
    }
  }, [claimReceipt]);

  return {
    isClaimed,
    claimReceipt,
    claim,
    isLoading: isLoading || isWaiting,
    refetch,
  };
}
