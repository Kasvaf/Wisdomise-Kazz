import dayjs from 'dayjs';
import { clsx } from 'clsx';
import useModal from 'shared/useModal';
import UnlockModalContent from 'modules/account/PageToken/UnlockModalContent';
import { useWithdraw } from 'modules/account/PageToken/web3/locking/useWithdraw';
import { Button } from 'shared/v1-components/Button';
import { useEnsureWalletConnected } from 'modules/account/PageToken/useEnsureWalletConnected';
import { useUtility } from './web3/locking/useUtility';

export default function Utility() {
  const { unlockedBalance, withdrawTimestamp, utilityStatus } = useUtility();

  const [unlockModal, openUnlockModal] = useModal(UnlockModalContent, {
    mobileDrawer: true,
  });
  const ensureWalletConnected = useEnsureWalletConnected();

  const unlock = async () => {
    if (await ensureWalletConnected()) {
      void openUnlockModal({});
    }
  };

  const { withdraw, isPending, isWaiting } = useWithdraw();

  return (
    <div
      className={clsx(
        'relative mt-4 overflow-hidden',
        utilityStatus !== 'locked' &&
          'rounded-xl border border-v1-inverse-overlay-10 px-5 py-4',
      )}
    >
      {utilityStatus === 'locked' ? (
        <div className="flex justify-end">
          {/* todo: check revenue reward */}
          <Button size="md" variant="negative_outline" onClick={unlock}>
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
        </div>
      ) : utilityStatus === 'pending_withdraw' ? (
        <div>
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
            className="mt-4"
            loading={isPending || isWaiting}
            onClick={() => withdraw()}
          >
            {isPending
              ? 'Waiting for withdraw signature'
              : isWaiting
              ? 'Withdraw transaction is confirming'
              : 'Withdraw'}
          </Button>
        </div>
      ) : null}
      {unlockModal}
    </div>
  );
}
