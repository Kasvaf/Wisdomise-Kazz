import { useWaitForTransaction } from 'wagmi';
import { useEffect } from 'react';
import { notification } from 'antd';
import {
  useReadAngelAccountShares,
  useReadAngelReleasable,
  useReadStrategicAccountShares,
  useReadStrategicReleasable,
  useWriteAngelRelease,
  useWriteStrategicRelease,
} from 'modules/account/PageToken/web3/tokenDistributer/contract';
import { useWsdmBalance } from 'modules/account/PageToken/web3/wsdm/contract';
import {
  angelReleasePercentage,
  strategicReleasePercentage,
} from 'modules/account/PageToken/constants';

export function useVesting() {
  const { refetch: refetchWsdmBalance } = useWsdmBalance();

  const { data: angelTotalAmount, refetch: refetchAngelTotalAmount } =
    useReadAngelAccountShares();
  const { data: angelClaimable, refetch: refetchAngelClaimable } =
    useReadAngelReleasable();
  const {
    write: claimAngelShare,
    isLoading: claimAngelIsLoading,
    data: claimAngelResult,
  } = useWriteAngelRelease();
  const {
    data: claimAngelTrxReceipt,
    isLoading: claimAngelTrxReceiptIsLoading,
  } = useWaitForTransaction({
    hash: claimAngelResult?.hash,
  });

  const { data: strategicTotalAmount, refetch: refetchStrategicTotalAmount } =
    useReadStrategicAccountShares();
  const { data: strategicClaimable, refetch: refetchStrategicClaimable } =
    useReadStrategicReleasable();
  const {
    write: claimStrategicShare,
    isLoading: claimStrategicIsLoading,
    data: claimStrategicResult,
  } = useWriteStrategicRelease();
  const {
    data: claimStrategicTrxReceipt,
    isLoading: claimStrategicTrxReceiptIsLoading,
  } = useWaitForTransaction({
    hash: claimStrategicResult?.hash,
  });

  useEffect(() => {
    if (claimAngelTrxReceipt?.status === 'success') {
      notification.success({ message: 'Claim was successful' });
      void refetchAngelClaimable();
      void refetchWsdmBalance();
    }
  }, [claimAngelTrxReceipt, refetchAngelClaimable, refetchWsdmBalance]);

  useEffect(() => {
    if (claimStrategicTrxReceipt?.status === 'success') {
      notification.success({ message: 'Claim was successful' });
      void refetchStrategicClaimable();
      void refetchWsdmBalance();
    }
  }, [claimStrategicTrxReceipt, refetchStrategicClaimable, refetchWsdmBalance]);

  const roundDetails = [
    {
      id: 'angel',
      name: 'Angel Round',
      totalAmount: angelTotalAmount,
      claimable: angelClaimable,
      releasePercentage: angelReleasePercentage,
    },
    {
      id: 'strategic',
      name: 'Strategic Round',
      totalAmount: strategicTotalAmount,
      claimable: strategicClaimable,
      releasePercentage: strategicReleasePercentage,
    },
  ] as const;

  const refetchAll = () => {
    void refetchAngelTotalAmount();
    void refetchAngelClaimable();
    void refetchStrategicTotalAmount();
    void refetchStrategicClaimable();
  };

  return {
    roundDetails,
    refetchAngelClaimable,
    claimAngelShare,
    angelIsLoading: claimAngelTrxReceiptIsLoading || claimAngelIsLoading,
    strategicIsLoading:
      claimStrategicTrxReceiptIsLoading || claimStrategicIsLoading,
    claimStrategicShare,
    refetchStrategicClaimable,
    angelTotalAmount,
    strategicTotalAmount,
    refetchAll,
  };
}
