import { notification } from 'antd';
import { useCandlesQuery } from 'api';
import { useLockingStateQuery } from 'api/defi';
import dayjs from 'dayjs';
import { useLockWithApprove } from 'modules/account/PageToken/web3/locking/useLocking';
import { useWSDMBalance } from 'modules/account/PageToken/web3/wsdm/contract';
import { useMemo, useState } from 'react';
import { Button } from 'shared/v1-components/Button';
import { Input } from 'shared/v1-components/Input';
import { addComma, formatNumber } from 'utils/numbers';
import { ReactComponent as Polygon } from './polygon.svg';
import stakeBg from './stake-bg.png';
import { ReactComponent as Wsdm } from './wsdm.svg';

export default function StakeModalContent() {
  const [now] = useState(Date.now());
  const params = useMemo(
    () =>
      ({
        pairName: 'WSDMUSDT',
        resolution: '5m',
        startDateTime: dayjs(now).subtract(10, 'minute').toISOString(),
        endDateTime: new Date(now).toISOString(),
        marketName: 'KUCOIN',
      }) as const,
    [now],
  );

  const { data: candles } = useCandlesQuery(params);
  const { data, refetch } = useWSDMBalance();
  const { data: lockState, refetch: refetchLockState } = useLockingStateQuery();
  const [amount, setAmount] = useState<number>();
  const {
    lockWithApprove,
    approveIsPending,
    approveIsWaiting,
    lockingIsPending,
    lockingIsWaiting,
  } = useLockWithApprove();

  const balance = Number(data?.value ?? 0n) / 10 ** (data?.decimals ?? 0);
  const invalidAmount = (amount ?? 0) <= 0 || (amount ?? 0) > balance;
  const wsdmPrice = candles?.[0]?.close ?? 0;

  const lock = async () => {
    await lockWithApprove(BigInt((amount ?? 0) * 10 ** 6));
    void refetch();
    void refetchLockState();
    notification.success({ message: 'Tokens staked successfully.' });
  };

  return (
    <div>
      <img
        alt=""
        className="absolute top-0 left-0 h-full w-full"
        src={stakeBg}
      />
      <div className="relative">
        <h1 className="mt-3 font-medium text-2xl">Stake $WSDM</h1>
        <hr className="my-8 border-v1-inverse-overlay-10" />
        <div className="overflow-hidden rounded-xl bg-v1-inverse-overlay-10 p-3">
          <div className="flex items-center gap-2">
            <Polygon className="h-4 w-auto" />
            Network
          </div>
          <hr className="my-3 border-v1-inverse-overlay-10" />
          <p className="text-xs">
            Connect Your Wallet and Confirm Staking Transaction. Make sure you
            have enough $WSDM to Stake.
          </p>

          <div className="mt-6 flex flex-col gap-1">
            <p className="font-medium text-v1-inverse-overlay-70 text-xs">
              Current Staked Amount
            </p>
            <h3 className="flex items-baseline gap-1 font-semibold text-xl">
              {addComma(lockState?.locked_wsdm_balance)}
              <span className="font-normal text-sm">WSDM</span>
            </h3>
          </div>
        </div>
        <p className="mt-8 mb-3 flex justify-between">
          <span>Amount</span>
          <button
            className="text-v1-content-secondary"
            onClick={() => setAmount(balance)}
          >
            Balance:{' '}
            {formatNumber(balance, {
              compactInteger: false,
              separateByComma: true,
              decimalLength: 2,
              minifyDecimalRepeats: false,
            })}{' '}
            WSDM
          </button>
        </p>
        <Input
          className="w-full"
          max={balance}
          min={0}
          onChange={value => {
            setAmount(value);
          }}
          placeholder="0.0"
          suffixIcon={
            <div className="mr-1 flex items-center gap-2">
              <span className="shrink-0 text-v1-content-secondary">
                ${(amount ?? 0) * wsdmPrice}
              </span>
              <div className="h-6 border-v1-border-secondary border-r"></div>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-v1-overlay-10">
                <Wsdm className="" />
              </div>
              $WSDM
            </div>
          }
          type="number"
          value={amount}
        />
        <Button
          className="mt-8 w-full"
          disabled={invalidAmount}
          loading={
            approveIsPending ||
            approveIsWaiting ||
            lockingIsPending ||
            lockingIsWaiting
          }
          onClick={() => lock()}
          variant="white"
        >
          {approveIsPending
            ? 'Waiting for approval signature...'
            : approveIsWaiting
              ? 'Approval transaction is confirming...'
              : lockingIsPending
                ? 'Waiting for staking signature...'
                : lockingIsWaiting
                  ? 'Staking transaction is confirming...'
                  : invalidAmount
                    ? 'Invalid Amount'
                    : 'Stake Now'}
        </Button>
      </div>
    </div>
  );
}
