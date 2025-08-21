import { clsx } from 'clsx';
import dayjs from 'dayjs';
import UnlockModalContent from 'modules/account/PageToken/UnlockModalContent';
import { useEnsureWalletConnected } from 'modules/account/PageToken/useEnsureWalletConnected';
import { useWithdraw } from 'modules/account/PageToken/web3/locking/useWithdraw';
import useModal from 'shared/useModal';
import { Button } from 'shared/v1-components/Button';
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
          <Button onClick={unlock} size="md" variant="negative_outline">
            Unlock & Exit Wise Club
          </Button>
        </div>
      ) : utilityStatus === 'pending_unlock' ? (
        <div className="flex flex-col gap-2">
          <h3 className="gap-2 font-semibold text-xl">
            {dayjs(withdrawTimestamp * 1000).toNow(true)}{' '}
            <span className="font-normal text-base">Left</span>
          </h3>
          <p className="text-v1-inverse-overlay-50 text-xs">
            {unlockedBalance} WSDM
          </p>
          <p className="font-medium text-v1-inverse-overlay-70 text-xs">
            Until withdraw
          </p>
        </div>
      ) : utilityStatus === 'pending_withdraw' ? (
        <div>
          <div className="flex flex-col gap-2">
            <h3 className="gap-2 font-semibold text-xl">Ready to Withdraw</h3>
            <p className="text-v1-inverse-overlay-50 text-xs">
              {unlockedBalance} WSDM
            </p>
            <p className="font-medium text-v1-inverse-overlay-70 text-xs">
              Your tokens are unlocked
            </p>
          </div>
          <Button
            className="mt-4"
            loading={isPending || isWaiting}
            onClick={() => withdraw()}
            size="md"
            variant="white"
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
