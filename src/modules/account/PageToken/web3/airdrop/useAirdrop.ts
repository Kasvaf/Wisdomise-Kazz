import { useAccount, useWaitForTransaction } from 'wagmi';
import { notification } from 'antd';
import { useEffect } from 'react';
import {
  useReadAirdropIsClaimed,
  useWriteClaimAirdrop,
} from 'modules/account/PageToken/web3/airdrop/contract';
import type { Airdrop } from 'api/airdrop';
import { extractWagmiErrorMessage } from 'utils/error';

export function useAirdrop(airdrop?: Airdrop) {
  const { writeAsync, data: claimResult, isLoading } = useWriteClaimAirdrop();
  const { data: isClaimed, refetch } = useReadAirdropIsClaimed(airdrop?.index);
  const { address } = useAccount();
  const { data: claimReceipt, isLoading: isWaiting } = useWaitForTransaction({
    hash: claimResult?.hash,
    enabled: !!claimResult?.hash,
  });

  const claim = async () => {
    if (
      airdrop?.amount &&
      address &&
      airdrop?.index !== undefined &&
      airdrop?.proofs
    ) {
      void writeAsync({
        args: [
          BigInt(airdrop.index),
          address,
          BigInt(airdrop.amount),
          airdrop.proofs,
        ],
      }).catch(error =>
        notification.error({
          message: extractWagmiErrorMessage(error.message),
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
