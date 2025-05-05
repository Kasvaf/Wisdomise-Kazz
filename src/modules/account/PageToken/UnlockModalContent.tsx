import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { useInstantCancelMutation } from 'api';
import {
  useReadLockedUsers,
  useWriteUnlock,
} from 'modules/account/PageToken/web3/locking/contract';
import { Button } from 'shared/v1-components/Button';
import { ReactComponent as UnlockIcon } from './icons/unlock.svg';
import { useUtility } from './web3/locking/useUtility';

export default function UnlockModalContent({
  onResolve,
}: {
  onResolve: VoidFunction;
}) {
  const { t } = useTranslation('wisdomise-token');
  const { lockedBalance, refetchUnlockedInfo } = useUtility();
  const { writeAndWait, isWaiting, isPending } = useWriteUnlock();
  const { mutateAsync: cancelSub, isPending: isCanceling } =
    useInstantCancelMutation();
  const { data } = useReadLockedUsers();

  const cooldown = data?.configId
    ? data.configId === 1n
      ? '7 Days'
      : '1 Month'
    : 'Loading';

  const unlock = async () => {
    await writeAndWait();
    notification.success({
      message:
        'Your WSDM Tokens are unlocked successfully. wait for unlock period then you can withdraw your tokens here',
    });
    await cancelSub();
    await refetchUnlockedInfo();
    onResolve();
  };

  return (
    <div className="flex flex-col items-center text-center md:px-8">
      <div className="mb-6 flex size-28 items-center justify-between rounded-full bg-black/20">
        <UnlockIcon />
      </div>
      <h1 className="mb-3 text-2xl font-medium">
        {t('utility.unlock-modal.title')}
      </h1>
      <p className="text-sm text-white/60">
        By unlocking your WSDM tokens, you are opting out of our subscription
        services.
      </p>
      <div className="my-8 flex w-full items-center justify-between gap-y-8 rounded-xl bg-v1-surface-l3 p-5 text-start max-md:flex-wrap">
        <div>
          <h2 className="mb-2 text-xs text-v1-content-secondary">
            {t('utility.unlock-modal.withdraw-available')}
          </h2>
          <div className="text-xl font-semibold">{cooldown}</div>
        </div>
        <div>
          <h2 className="mb-2 text-xs text-v1-content-secondary">
            {t('utility.unlock-modal.amount')}
          </h2>
          <div className="flex items-end gap-2">
            <span className="text-xl font-semibold">{lockedBalance}</span>{' '}
            <span className="font-light">WSDM</span>
          </div>
        </div>
      </div>
      <p className="mb-6 text-sm text-v1-content-negative">
        {t('utility.unlock-modal.downgrade-warn')}
      </p>
      <div className="mb-4 flex w-full gap-4 max-md:flex-col">
        <Button className="grow" variant="outline" onClick={onResolve}>
          {t('utility.unlock-modal.not-now')}
        </Button>
        <Button
          className="grow"
          loading={isPending || isWaiting || isCanceling}
          variant="negative"
          onClick={() => unlock()}
        >
          {isPending
            ? 'Waiting for unlock signature'
            : isWaiting
            ? 'Unlock transaction is confirming'
            : 'Unlock & Exit Wise Club'}
        </Button>
      </div>
    </div>
  );
}
