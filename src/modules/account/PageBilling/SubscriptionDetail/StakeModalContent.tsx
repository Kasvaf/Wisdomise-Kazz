import { useState } from 'react';
import { notification } from 'antd';
import { Input } from 'shared/v1-components/Input';
import { Button } from 'shared/v1-components/Button';
import { useLockWithApprove } from 'modules/account/PageToken/web3/locking/useLocking';
import { useWSDMBalance } from 'modules/account/PageToken/web3/wsdm/contract';
import { formatNumber } from 'utils/numbers';
import { ReactComponent as Polygon } from './polygon.svg';
import { ReactComponent as Wsdm } from './wsdm.svg';
import stakeBg from './stake-bg.png';

export default function StakeModalContent() {
  // const { data: candles } = useCandlesQuery({
  //   asset: 'WSDMUSDT',
  //   resolution: '1m',
  //   startDateTime: new Date(Date.now() - 10_000).toISOString(),
  //   endDateTime: new Date().toISOString(),
  //   market: 'SPOT',
  // });
  const { data, refetch } = useWSDMBalance();
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

  const lock = async () => {
    await lockWithApprove(BigInt((amount ?? 0) * 10 ** 6));
    void refetch();
    notification.success({ message: 'Tokens staked successfully.' });
  };

  return (
    <div>
      <img
        src={stakeBg}
        alt=""
        className="absolute left-0 top-0 h-full w-full"
      />
      <div className="relative">
        <h1 className="mt-3 text-2xl font-medium">Stake $WSDM</h1>
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
        </div>
        <p className="mb-3 mt-8 flex justify-between">
          <span>Amount</span>
          <button
            className="text-v1-content-secondary"
            onClick={() => setAmount(balance)}
          >
            Balance:{' '}
            {formatNumber(balance, {
              compactInteger: false,
              seperateByComma: true,
              decimalLength: 2,
              minifyDecimalRepeats: false,
            })}{' '}
            WSDM
          </button>
        </p>
        <Input
          className="w-full"
          value={amount}
          min={0}
          max={balance}
          placeholder="0.0"
          type="number"
          suffixIcon={
            <div className="mr-1 flex items-center gap-2">
              {/* <span className="shrink-0 text-v1-content-secondary"> */}
              {/*   ${amount} */}
              {/* </span> */}
              {/* <div className="h-6 border-r border-v1-border-secondary"></div> */}
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-v1-overlay-10">
                <Wsdm className="" />
              </div>
              $WSDM
            </div>
          }
          onChange={value => {
            setAmount(value);
          }}
        />
        <Button
          className="mt-8 w-full"
          variant="outline"
          onClick={() => lock()}
          loading={
            approveIsPending ||
            approveIsWaiting ||
            lockingIsPending ||
            lockingIsWaiting
          }
          disabled={invalidAmount}
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
