import { notification } from 'antd';
import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocking } from 'modules/account/PageToken/web3/locking/useLocking';
import Button from 'shared/Button';
import { useUnlock } from 'modules/account/PageToken/web3/locking/useUnlock';
import { useInstantCancelMutation } from 'api';
import { unwrapErrorMessage } from 'utils/error';
import { ReactComponent as UnlockIcon } from './icons/unlock.svg';

export default function UnlockModalContent({
  onResolve,
}: {
  onResolve: VoidFunction;
}) {
  const { t } = useTranslation('wisdomise-token');
  const { lockedBalance, refetchUnlockedInfo } = useLocking();
  const { unlock, isLoading, trxReceipt } = useUnlock();
  const { mutateAsync: cancelSub, isLoading: isCanceling } =
    useInstantCancelMutation();

  useEffect(() => {
    if (trxReceipt) {
      if (trxReceipt.status === 'success') {
        notification.success({
          message: 'Your WSDM Tokens are unlocked successfully',
        });
        void refetchUnlockedInfo();
        void cancelSub()
          .then(() => onResolve())
          .catch(error => {
            notification.error({ message: unwrapErrorMessage(error) });
          });
      } else {
        notification.error({ message: 'Transaction reverted' });
      }
    }
  }, [cancelSub, onResolve, refetchUnlockedInfo, trxReceipt]);

  return (
    <div className="mt-10 flex flex-col items-center text-center md:px-8">
      <div className="mb-6 flex h-28 w-28 items-center justify-between rounded-full bg-black/20">
        <UnlockIcon />
      </div>
      <h1 className="mb-3 text-2xl font-medium">
        {t('utility.unlock-modal.title')}
      </h1>
      <p className="text-sm text-white/60">
        <Trans
          i18nKey="wisdomise-token:utility.unlock-modal.description"
          ns="wisdomise-token"
        >
          By unlocking your WSDM tokens, you are opting out of our subscription
          services. <br />
          <span className="text-white">
            Withdrawals are available in 7 days.
          </span>
        </Trans>
      </p>
      <div className="my-8 flex w-full items-center justify-between gap-y-8 rounded-2xl bg-black/30 p-10 text-start max-md:flex-wrap">
        <div>
          <h2 className="mb-3 text-sm text-white/60">
            {t('utility.unlock-modal.withdraw-available')}
          </h2>
          <div className="text-xl font-semibold">
            {t('utility.unlock-modal.days')}
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-sm text-white/60">
            {t('utility.unlock-modal.amount')}
          </h2>
          <div className="flex items-end gap-2">
            <span className="text-xl font-semibold">{lockedBalance}</span>{' '}
            <span className="font-light">WSDM</span>
          </div>
        </div>
      </div>
      <p className="mb-6 text-sm text-red-400">
        {t('utility.unlock-modal.downgrade-warn')}
      </p>
      <div className="mb-4 flex w-full gap-4 max-md:flex-col">
        <Button className="grow" variant="secondary" onClick={onResolve}>
          {t('utility.unlock-modal.not-now')}
        </Button>
        <Button
          className="grow"
          loading={isLoading || isCanceling}
          disabled={isLoading}
          variant="secondary-red"
          onClick={() => unlock()}
        >
          {t('utility.unlock-modal.cancel-sub')}
        </Button>
      </div>
    </div>
  );
}
