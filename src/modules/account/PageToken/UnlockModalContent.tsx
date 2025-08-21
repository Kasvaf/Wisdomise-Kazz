import { notification } from 'antd';
import { useInstantCancelMutation } from 'api';
import {
  useReadLockedUsers,
  useWriteUnlock,
} from 'modules/account/PageToken/web3/locking/contract';
import { useTranslation } from 'react-i18next';
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
      <h1 className="mb-3 font-medium text-2xl">
        {t('utility.unlock-modal.title')}
      </h1>
      <p className="text-sm text-white/60">
        By unlocking your WSDM tokens, you are opting out of our subscription
        services.
      </p>
      <div className="my-8 grid w-full grid-cols-2 gap-x-16 rounded-xl bg-v1-surface-l3 p-5 text-start max-md:flex-wrap">
        <div>
          <h2 className="mb-2 text-v1-content-secondary text-xs">
            {t('utility.unlock-modal.withdraw-available')}
          </h2>
          <div className="font-semibold text-xl">{cooldown}</div>
          <p className="mt-2 text-v1-inverse-overlay-70 text-xs">Cooldown</p>
        </div>
        <div>
          <h2 className="mb-2 text-v1-content-secondary text-xs">
            {t('utility.unlock-modal.amount')}
          </h2>
          <div className="flex items-end gap-2">
            <span className="font-semibold text-xl">{lockedBalance}</span>{' '}
          </div>
          <p className="mt-2 text-v1-inverse-overlay-70 text-xs">WSDM</p>
        </div>
      </div>
      <p className="mb-6 text-sm text-v1-content-negative">
        {t('utility.unlock-modal.downgrade-warn')}
      </p>
      <div className="mb-4 flex w-full gap-4 max-md:flex-col">
        <Button className="grow" onClick={onResolve} variant="outline">
          {t('utility.unlock-modal.not-now')}
        </Button>
        <Button
          className="grow"
          loading={isPending || isWaiting || isCanceling}
          onClick={() => unlock()}
          variant="negative_outline"
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
