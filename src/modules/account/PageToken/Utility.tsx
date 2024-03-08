import dayjs from 'dayjs';
import Button from 'shared/Button';
import Card from 'shared/Card';
import useModal from 'shared/useModal';
import PricingTable from 'modules/account/PageBilling/PricingTable';
import { useSubscription } from 'api';
import { useLocking } from 'modules/account/PageToken/web3/locking/useLocking';
import UnlockModalContent from 'modules/account/PageToken/UnlockModalContent';
import { useWithdraw } from 'modules/account/PageToken/web3/locking/useWithdraw';
import ImportTokenButton from 'modules/account/PageToken/ImportTokenButton';
import { ReactComponent as SubscriptionIcon } from './icons/subscription.svg';
import { ReactComponent as BadgeIcon } from './icons/badge.svg';

export type UtilityStatus =
  | 'already_active'
  | 'pending_lock'
  | 'locked'
  | 'pending_unlock'
  | 'pending_withdraw';

export default function Utility() {
  const [pricingTableModal, openPricingTable] = useModal(PricingTable, {
    width: 1200,
  });
  const { lockedBalance, unlockedBalance, withdrawTimestamp, utilityStatus } =
    useLocking();
  const [unlockModal, openUnlockModal] = useModal(UnlockModalContent);
  const { title } = useSubscription();
  const { withdraw, isLoading } = useWithdraw();

  const openBillings = () => {
    void openPricingTable({ isTokenUtility: true });
  };

  return (
    <Card className="relative flex gap-8">
      <SubscriptionIcon className="absolute right-0 top-0" />
      <h2 className="mb-2 text-2xl font-medium">Utility Activation</h2>
      {utilityStatus === 'already_active' ? (
        <p className="mt-2 text-white/60">
          You already have an active subscription.
        </p>
      ) : utilityStatus === 'pending_lock' ? (
        <div className="me-40 mt-4 flex grow flex-col items-center text-center">
          <strong className="mb-2 font-medium">Activate Subscription</strong>
          <p className="mb-2 text-white/40">
            Lock your $WSDM tokens to gain access to our products.
          </p>
          <Button variant="alternative" onClick={openBillings}>
            Lock WSDM
          </Button>
        </div>
      ) : (
        <div className="me-32 mt-4 flex grow justify-between gap-9">
          <div className="grow">
            <h3 className="mb-6">
              {utilityStatus === 'locked'
                ? 'Locked'
                : utilityStatus === 'pending_unlock'
                ? 'Pending for Unlock'
                : utilityStatus === 'pending_withdraw'
                ? 'Pending for Withdraw'
                : 'Loading'}
            </h3>
            <div className="flex flex-wrap items-center justify-between gap-4">
              {utilityStatus === 'pending_unlock' && (
                <div>
                  <h4 className="mb-2 text-sm text-white/60">
                    Withdrawal available in
                  </h4>
                  <div className="text-xl font-semibold">
                    {dayjs(withdrawTimestamp * 1000).toNow(true)}
                  </div>
                </div>
              )}
              {utilityStatus === 'pending_withdraw' && (
                <div>
                  <h4 className="mb-2 text-sm text-white/60">
                    Time to withdrawal
                  </h4>
                  <div className="flex items-center gap-2">
                    <BadgeIcon />
                    <div>Ready</div>
                  </div>
                </div>
              )}
              <div>
                <h3 className="mb-2 text-sm text-white/60">Amount</h3>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-semibold">
                    {utilityStatus === 'locked'
                      ? lockedBalance
                      : unlockedBalance}
                  </span>{' '}
                  <span className="font-light">WSDM</span>
                </div>
              </div>
              {utilityStatus === 'locked' && (
                <div className="flex gap-4">
                  <ImportTokenButton
                    tokenSymbol="lcWSDM"
                    variant="alternative"
                  />
                  <Button variant="secondary" onClick={openUnlockModal}>
                    Unlock
                  </Button>
                </div>
              )}
              {(utilityStatus === 'pending_withdraw' ||
                utilityStatus === 'pending_unlock') && (
                <div className="flex gap-4">
                  <Button
                    disabled={utilityStatus === 'pending_unlock' || isLoading}
                    variant="secondary"
                    loading={isLoading}
                    onClick={() => withdraw()}
                  >
                    Withdraw
                  </Button>
                  {utilityStatus === 'pending_withdraw' && (
                    <Button variant="primary-purple" onClick={openBillings}>
                      Lock Tokens
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="h-full w-px border-r border-white/20"></div>
          <div>
            <h3 className="mb-9">Subscription</h3>
            <div className="text-4xl">{title}</div>
          </div>
        </div>
      )}
      {pricingTableModal}
      {unlockModal}
    </Card>
  );
}
