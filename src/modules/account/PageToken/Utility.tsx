import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import useModal from 'shared/useModal';
import UnlockModalContent from 'modules/account/PageToken/UnlockModalContent';
import { useWithdraw } from 'modules/account/PageToken/web3/locking/useWithdraw';
import { Button } from 'shared/v1-components/Button';
import { useEnsureWalletConnected } from 'modules/account/PageToken/useEnsureWalletConnected';
import { useVipModal } from 'modules/account/PageBilling/useVipModal';
import { useUtility } from './web3/locking/useUtility';

export default function Utility() {
  const { t } = useTranslation('wisdomise-token');
  const { unlockedBalance, withdrawTimestamp, utilityStatus } = useUtility();

  const [unlockModal, openUnlockModal] = useModal(UnlockModalContent, {
    mobileDrawer: true,
  });
  const ensureWalletConnected = useEnsureWalletConnected();

  const unlock = () => {
    if (ensureWalletConnected()) {
      void openUnlockModal({});
    }
  };

  const { withdraw, isPending, isWaiting } = useWithdraw();
  const { tokenPaymentModal, openVipModal } = useVipModal();

  return (
    <div
      className={clsx(
        'relative mt-4 overflow-hidden',
        utilityStatus !== 'locked' &&
          'rounded-xl border border-v1-inverse-overlay-10 p-5',
      )}
    >
      {utilityStatus === 'locked' ? (
        <div className="flex justify-end">
          {/* todo: check revenue reward */}
          <Button size="md" variant="negative" onClick={unlock}>
            Unlock & Exit Wise Club
          </Button>
        </div>
      ) : utilityStatus === 'pending_unlock' ? (
        <div className="flex flex-col gap-2">
          <h3 className="gap-2 text-xl font-semibold">
            {dayjs(withdrawTimestamp * 1000).toNow(true)}{' '}
            <span className="text-base font-normal">Left</span>
          </h3>
          <p className="text-xs text-v1-inverse-overlay-50">
            {unlockedBalance} WSDM
          </p>
          <p className="text-xs font-medium text-v1-inverse-overlay-70">
            Until withdraw
          </p>

          <div className="mt-10">
            <p className="text-sm">Want to join Wise club again?</p>
            <p className="mt-2 text-sm text-v1-content-secondary">
              If you have more WSDM you can join again until your previous
              staked amount are ready to withdraw
            </p>
            <Button
              variant="wsdm"
              className="mt-4"
              size="md"
              onClick={() => openVipModal()}
            >
              Stake & Join Wise Club
            </Button>
          </div>
        </div>
      ) : utilityStatus === 'pending_withdraw' ? (
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="gap-2 text-xl font-semibold">Ready to Withdraw</h3>
            <p className="text-xs text-v1-inverse-overlay-50">
              {unlockedBalance} WSDM
            </p>
            <p className="text-xs font-medium text-v1-inverse-overlay-70">
              Your tokens are unlocked
            </p>
          </div>
          <Button
            variant="white"
            size="md"
            loading={isPending || isWaiting}
            onClick={() => withdraw()}
          >
            {t('utility.withdraw')}
          </Button>
        </div>
      ) : null}
      {unlockModal}
      {tokenPaymentModal}
    </div>
  );
}
