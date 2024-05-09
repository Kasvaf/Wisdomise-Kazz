import { useWaitForTransaction } from 'wagmi';
import { useEffect } from 'react';
import { notification } from 'antd';
import {
  type Bucket,
  useReadAccountShares,
  useReadReleasable,
  useWriteRelease,
} from 'modules/account/PageToken/web3/tokenDistributer/contract';
import { useWsdmBalance } from 'modules/account/PageToken/web3/wsdm/contract';
import {
  angelReleasePercentage,
  angelReleaseTimestamps,
  institutionalReleasePercentage,
  institutionalReleaseTimestamps,
  kolReleasePercentage,
  kolReleaseTimestamps,
  publicRoundReleasePercentage,
  publicRoundReleaseTimestamps,
  strategicReleasePercentage,
  strategicReleaseTimestamps,
} from 'modules/account/PageToken/constants';

export function useVesting() {
  const {
    totalAmount: angelTotalAmount,
    claimable: angelClaimable,
    refetch: refetchAngel,
    claimShare: claimAngelShare,
    isLoading: angelIsLoading,
  } = useBucketVesting('angel');

  const {
    totalAmount: strategicTotalAmount,
    claimable: strategicClaimable,
    refetch: refetchStrategic,
    claimShare: claimStrategicShare,
    isLoading: strategicIsLoading,
  } = useBucketVesting('strategic');

  const {
    totalAmount: kolTotalAmount,
    claimable: kolClaimable,
    refetch: refetchKol,
    claimShare: claimKolShare,
    isLoading: kolIsLoading,
  } = useBucketVesting('kol');

  const {
    totalAmount: institutionalTotalAmount,
    claimable: institutionalClaimable,
    refetch: refetchInstitutional,
    claimShare: claimInstitutionalShare,
    isLoading: institutionalIsLoading,
  } = useBucketVesting('institutional');

  const {
    totalAmount: publicTotalAmount,
    claimable: publicClaimable,
    refetch: refetchPublic,
    claimShare: claimPublicShare,
    isLoading: publicIsLoading,
  } = useBucketVesting('public');

  const bucketsDetails = [
    {
      name: 'Angel Round',
      totalAmount: angelTotalAmount,
      claimable: angelClaimable,
      claim: claimAngelShare,
      claimIsLoading: angelIsLoading,
      nextRelease: {
        timestamp: findNextReleaseTimestamp(angelReleaseTimestamps),
        amount: calculateNextReleaseAmount(
          angelReleaseTimestamps,
          angelTotalAmount,
          angelReleasePercentage,
        ),
      },
    },
    {
      name: 'Strategic Round',
      totalAmount: strategicTotalAmount,
      claimable: strategicClaimable,
      claim: claimStrategicShare,
      claimIsLoading: strategicIsLoading,
      nextRelease: {
        timestamp: findNextReleaseTimestamp(strategicReleaseTimestamps),
        amount: calculateNextReleaseAmount(
          strategicReleaseTimestamps,
          strategicTotalAmount,
          strategicReleasePercentage,
        ),
      },
    },
    {
      name: 'KOL',
      totalAmount: kolTotalAmount,
      claimable: kolClaimable,
      claim: claimKolShare,
      claimIsLoading: kolIsLoading,
      nextRelease: {
        timestamp: findNextReleaseTimestamp(kolReleaseTimestamps),
        amount: calculateNextReleaseAmount(
          kolReleaseTimestamps,
          kolTotalAmount,
          kolReleasePercentage,
        ),
      },
    },
    {
      name: 'Institutional',
      totalAmount: institutionalTotalAmount,
      claimable: institutionalClaimable,
      claim: claimInstitutionalShare,
      claimIsLoading: institutionalIsLoading,
      nextRelease: {
        timestamp: findNextReleaseTimestamp(institutionalReleaseTimestamps),
        amount: calculateNextReleaseAmount(
          institutionalReleaseTimestamps,
          institutionalTotalAmount,
          institutionalReleasePercentage,
        ),
      },
    },
    {
      name: 'Public Round',
      totalAmount: publicTotalAmount,
      claimable: publicClaimable,
      claim: claimPublicShare,
      claimIsLoading: publicIsLoading,
      nextRelease: {
        timestamp: findNextReleaseTimestamp(publicRoundReleaseTimestamps),
        amount: calculateNextReleaseAmount(
          publicRoundReleaseTimestamps,
          publicTotalAmount,
          publicRoundReleasePercentage,
        ),
      },
    },
  ] as const;

  const refetchAll = () => {
    void refetchAngel();
    void refetchStrategic();
    void refetchKol();
    void refetchInstitutional();
    void refetchPublic();
  };

  return {
    bucketsDetails,
    hasShareInBucket:
      angelTotalAmount ||
      strategicTotalAmount ||
      kolTotalAmount ||
      institutionalTotalAmount ||
      publicTotalAmount,
    refetchAll,
  };
}

function useBucketVesting(bucket: Bucket) {
  const { refetch: refetchWsdmBalance } = useWsdmBalance();

  const { data: totalAmount, refetch: refetchTotalAmount } =
    useReadAccountShares(bucket);
  const { data: claimable, refetch: refetchAngelClaimable } =
    useReadReleasable(bucket);
  const {
    write: claimShare,
    isLoading,
    data: claimResult,
  } = useWriteRelease(bucket);
  const { data: claimTrxReceipt, isLoading: isWaiting } = useWaitForTransaction(
    {
      hash: claimResult?.hash,
    },
  );

  const refetch = () => {
    void refetchTotalAmount();
    void refetchAngelClaimable();
  };

  useEffect(() => {
    if (claimTrxReceipt?.status === 'success') {
      notification.success({ message: 'Claim was successful' });
      void refetchAngelClaimable();
      void refetchWsdmBalance();
    }
  }, [claimTrxReceipt, refetchAngelClaimable, refetchWsdmBalance]);

  return {
    totalAmount,
    claimable,
    refetch,
    claimShare,
    isLoading: isLoading || isWaiting,
  };
}

function findNextReleaseTimestamp(timestamps: number[]) {
  return (
    (timestamps.find(timestamp => timestamp * 1000 > Date.now()) ?? 0) * 1000
  );
}

function calculateNextReleaseAmount(
  timestamps: number[],
  totalAmount: bigint | undefined,
  releasePercentage: number,
) {
  return findNextReleaseTimestamp(timestamps) === 0
    ? 0
    : (Number(totalAmount ?? 0n) / 10 ** 6) * releasePercentage;
}
