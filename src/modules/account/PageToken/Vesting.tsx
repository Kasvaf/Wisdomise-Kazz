import { useEffect, useMemo } from 'react';
import { notification } from 'antd';
import { useWaitForTransaction } from 'wagmi';
import Button from 'shared/Button';
import Card from 'shared/Card';
import {
  useAngelRoundAccountShares,
  useAngelRoundReleasable,
  useStrategicRoundAccountShares,
  useStrategicRoundReleasable,
  useWriteAngelRelease,
  useWriteStrategicRelease,
} from 'modules/account/PageToken/web3/tokenDistributerContract';
import { addComma } from 'utils/numbers';
import {
  ANGEL_RELEASE_PERCENTAGE,
  ANGEL_RELEASE_TIMESTAMPS,
  STRATEGIC_RELEASE_PERCENTAGE,
  STRATEGIC_RELEASE_TIMESTAMPS,
} from 'modules/account/PageToken/constants';
import { ReactComponent as LockIcon } from './icons/lock.svg';

export default function Vesting() {
  const { data: angelRoundTotalAmount } = useAngelRoundAccountShares();
  const { data: angelRoundClaimable, refetch: refetchAngelClaimable } =
    useAngelRoundReleasable();
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

  const { data: strategicRoundTotalAmount } = useStrategicRoundAccountShares();
  const { data: strategicRoundClaimable, refetch: refetchStrategicClaimable } =
    useStrategicRoundReleasable();
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

  const handleClaim = (round: 'angel' | 'strategic') =>
    round === 'angel' ? claimAngelShare() : claimStrategicShare();

  const roundDetails = useMemo(() => {
    return [
      {
        id: 'angel',
        name: 'Angel Round',
        date: 'Q3 2023',
        totalAmount: angelRoundTotalAmount,
        claimable: angelRoundClaimable,
        releasePercentage: ANGEL_RELEASE_PERCENTAGE,
      },
      {
        id: 'strategic',
        name: 'Strategic Round',
        date: 'Q1 2024',
        totalAmount: strategicRoundTotalAmount,
        claimable: strategicRoundClaimable,
        releasePercentage: STRATEGIC_RELEASE_PERCENTAGE,
      },
    ] as const;
  }, [
    angelRoundClaimable,
    angelRoundTotalAmount,
    strategicRoundClaimable,
    strategicRoundTotalAmount,
  ]);

  useEffect(() => {
    if (claimAngelTrxReceipt?.status === 'success') {
      notification.success({ message: 'Claim was successful' });
      void refetchAngelClaimable();
    }
  }, [claimAngelTrxReceipt, refetchAngelClaimable]);

  useEffect(() => {
    if (claimStrategicTrxReceipt?.status === 'success') {
      notification.success({ message: 'Claim was successful' });
      void refetchStrategicClaimable();
    }
  }, [claimStrategicTrxReceipt, refetchStrategicClaimable]);

  const findNextRelease = (roundId: 'angel' | 'strategic') => {
    const time = (
      roundId === 'angel'
        ? ANGEL_RELEASE_TIMESTAMPS
        : STRATEGIC_RELEASE_TIMESTAMPS
    ).find(timestamp => timestamp * 1000 > Date.now());

    return time
      ? Math.ceil((time * 1000 - Date.now()) / (1000 * 60 * 60 * 24))
      : 0;
  };

  return (
    <Card className="relative mt-6">
      <LockIcon className="absolute right-0 top-0 m-7" />
      <h2 className="mb-2 text-2xl font-medium">Vesting</h2>
      <p className="pb-3 text-white/40">Wallet transactions and balance</p>
      {roundDetails.map(round => {
        return (
          <div
            key={round.name}
            className="my-3 flex items-center justify-between rounded-xl bg-[rgba(51,59,92,0.20)] p-3"
          >
            <div>
              <h3 className="mb-2 font-bold italic">{round.name}</h3>
              <span className="text-sm text-white/40">{round.date}</span>
            </div>
            <div className="me-8 h-10 !w-px bg-white/10"></div>
            <div>
              <div className="mb-3 text-sm text-white/40">
                <span>Total Amount</span>
              </div>
              <div>
                <span>{addComma((round.totalAmount ?? 0n) / 10n ** 6n)}</span>{' '}
                <span className="text-white/40">WSDM</span>
              </div>
            </div>
            <div>
              <div className="mb-3">
                <span className="text-sm text-white/40">Next unlock</span>
                <span className="ms-2">
                  in <span>{findNextRelease(round.id)}</span> days
                </span>
              </div>
              <div>
                {addComma(
                  (Number(round.totalAmount ?? 0n) * round.releasePercentage) /
                    10 ** 6,
                )}{' '}
                <span className="text-white/40">WSDM</span>
              </div>
            </div>
            <div>
              <div className="mb-3 text-sm text-white/40">
                <span>Claimable</span>
              </div>
              <div>
                <span className="text-white/40">
                  {Number(
                    ((round.claimable ?? 0n) * 100n) /
                      (round.totalAmount || 1n),
                  )}
                  %
                </span>{' '}
                <span className="ms-3">
                  {addComma((round.claimable ?? 0n) / 10n ** 6n)}{' '}
                  <span className="text-white/40">WSDM</span>
                </span>
              </div>
            </div>
            <Button
              variant="alternative"
              className="bg-gradient-to-bl from-[rgba(97,82,152,0.40)] from-15% to-[rgba(66,66,123,0.40)] to-75%"
              loading={
                round.id === 'angel'
                  ? claimAngelIsLoading || claimAngelTrxReceiptIsLoading
                  : claimStrategicIsLoading || claimStrategicTrxReceiptIsLoading
              }
              disabled={
                (round.claimable ?? 0n) === 0n ||
                (round.id === 'angel'
                  ? claimAngelIsLoading || claimAngelTrxReceiptIsLoading
                  : claimStrategicIsLoading) ||
                claimStrategicTrxReceiptIsLoading
              }
              onClick={() => handleClaim(round.id)}
            >
              Claim
            </Button>
          </div>
        );
      })}
    </Card>
  );
}
