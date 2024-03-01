import { notification } from 'antd';
import { useEffect } from 'react';
import { useLocking } from 'modules/account/PageToken/web3/useLocking';
import Button from 'shared/Button';
import { useUnlock } from 'modules/account/PageToken/web3/locking/contract';
import { ReactComponent as UnlockIcon } from './icons/unlock.svg';

export default function UnlockModalContent({
  onResolve,
}: {
  onResolve: VoidFunction;
}) {
  const { lockedBalance } = useLocking();
  const { unlock, isLoading, trxReceipt } = useUnlock();

  useEffect(() => {
    if (trxReceipt) {
      if (trxReceipt.status === 'success') {
        notification.success({
          message:
            'You unlocked your tokens successfully. your withdrawal will be available in 7 days',
        });
        onResolve();
      } else {
        notification.error({ message: 'Transaction reverted' });
      }
    }
  }, [onResolve, trxReceipt]);

  return (
    <div className="mt-10 flex flex-col items-center px-8 text-center">
      <div className="mb-6 flex h-28 w-28 items-center justify-between rounded-full bg-black/20">
        <UnlockIcon />
      </div>
      <h1 className="mb-3 text-2xl font-medium">Unlock WSDM tokens</h1>
      <p className="text-white/60">
        By unlocking your WSDM tokens, you are opting out of our subscription
        services.
        <span className="text-white">Withdrawals are available in 7 days.</span>
      </p>
      <div className="my-8 flex w-full items-center justify-between rounded-2xl bg-black/30 p-12 text-start">
        <div>
          <h2 className="mb-3 text-sm text-white/60">
            Withdrawal available in
          </h2>
          <div className="text-xl font-semibold">7 Days</div>
        </div>
        <div>
          <h2 className="mb-3 text-sm text-white/60">Amount</h2>
          <div className="flex items-end gap-2">
            <span className="text-xl font-semibold">{lockedBalance}</span>{' '}
            <span className="font-light">WSDM</span>
          </div>
        </div>
      </div>
      <div className="mb-4 flex w-full gap-4">
        <Button className="grow" variant="secondary" onClick={onResolve}>
          Cancel
        </Button>
        <Button
          className="grow"
          loading={isLoading}
          disabled={isLoading}
          variant="primary-purple"
          onClick={() => unlock()}
        >
          Proceed & Unlock
        </Button>
      </div>
    </div>
  );
}
