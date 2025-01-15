import dayjs from 'dayjs';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import Card from 'shared/Card';
import useModal from 'shared/useModal';
import PricingTable from 'modules/account/PageBilling/PricingTable';
import { useHasFlag, useSubscription } from 'api';
import UnlockModalContent from 'modules/account/PageToken/UnlockModalContent';
import { useWithdraw } from 'modules/account/PageToken/web3/locking/useWithdraw';
import { DebugPin } from 'shared/DebugPin';
import { ReactComponent as SubscriptionIcon } from './icons/subscription.svg';
import { ReactComponent as BadgeIcon } from './icons/badge.svg';
import { ReactComponent as InfoIcon } from './icons/info.svg';
import { useUtility } from './web3/locking/useUtility';

export type UtilityStatus =
  | 'already_active'
  | 'pending_lock'
  | 'locked'
  | 'pending_unlock'
  | 'pending_withdraw';

export default function Utility() {
  const { t } = useTranslation('wisdomise-token');
  const hasFlag = useHasFlag();
  const [pricingTableModal, openPricingTable] = useModal(PricingTable, {
    width: 1200,
  });
  const { lockedBalance, unlockedBalance, withdrawTimestamp, utilityStatus } =
    useUtility();
  const [unlockModal, openUnlockModal] = useModal(UnlockModalContent, {
    width: 600,
  });
  const { title, plan, level } = useSubscription();
  const { withdraw, isLoading } = useWithdraw();

  const openBillings = () => {
    void openPricingTable({ isTokenUtility: true });
  };

  return (
    <Card className="relative flex gap-8 max-md:flex-wrap">
      <SubscriptionIcon className="absolute right-0 top-0" />
      <h2 className="mb-2 flex items-center gap-2 self-start text-2xl font-medium">
        {t('utility.subtitle')}
        <Tooltip title={t('utility.description')}>
          <InfoIcon className="mb-4" />
        </Tooltip>
      </h2>
      {utilityStatus === 'already_active' ? (
        <p className="flex flex-wrap items-center gap-2 text-white/60">
          {t('utility.already-active')}
          <Button disabled={true} variant="alternative">
            {t('utility.lock-wsdm')}
          </Button>
          <Tooltip title={t('utility.lock-tooltip')}>
            <InfoIcon className="mb-4" />
          </Tooltip>
        </p>
      ) : utilityStatus === 'pending_lock' ? (
        <div className="mt-2 flex grow flex-col items-center text-center md:me-40">
          <strong className="mb-2 font-medium">
            {t('utility.activate-sub')}
          </strong>
          <p className="mb-4 text-white/40">{t('utility.lock-description')}</p>
          {hasFlag('/account/billing?payment_method=lock') && (
            <Button variant="primary-purple" onClick={openBillings}>
              <DebugPin
                title="/account/billing?payment_method=lock"
                color="orange"
              />
              {t('utility.lock-wsdm')}
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-2 flex grow justify-between gap-9 max-md:flex-wrap md:me-32">
          <div className="flex grow flex-col justify-between">
            <h3 className="mb-6">
              {utilityStatus === 'locked'
                ? t('utility.locked')
                : utilityStatus === 'pending_unlock'
                ? t('utility.pending-unlock')
                : utilityStatus === 'pending_withdraw'
                ? t('utility.pending-withdrawal')
                : t('utility.loading')}
            </h3>
            <div className="flex flex-wrap items-center justify-between gap-4">
              {(utilityStatus === 'pending_unlock' ||
                utilityStatus === 'pending_withdraw') && (
                <div>
                  <h4 className="mb-2 text-sm text-white/60">
                    {t('utility.remaining-time')}
                  </h4>
                  {utilityStatus === 'pending_unlock' && (
                    <div className="text-xl font-semibold">
                      {dayjs(withdrawTimestamp * 1000).toNow(true)}
                    </div>
                  )}
                  {utilityStatus === 'pending_withdraw' && (
                    <div className="flex items-center gap-2">
                      <BadgeIcon />
                      <div>{t('utility.ready')}</div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <h3 className="mb-2 text-sm text-white/60">
                  {t('utility.amount')}
                </h3>
                <div className="flex items-end gap-2">
                  <span className="text-xl font-semibold">
                    {utilityStatus === 'locked'
                      ? lockedBalance
                      : unlockedBalance}
                  </span>{' '}
                  <span className="font-light text-green-400">WSDM</span>
                </div>
              </div>
              {utilityStatus === 'locked' && (
                <div className="flex gap-4">
                  {level === 0 &&
                    hasFlag('/account/billing?payment_method=lock') && (
                      <Button variant="alternative" onClick={openBillings}>
                        <DebugPin
                          title="/account/billing?payment_method=lock"
                          color="orange"
                        />
                        {t('utility.activate')}
                      </Button>
                    )}
                  <Button variant="secondary" onClick={openUnlockModal}>
                    {t('utility.unlock')}
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
                    {t('utility.withdraw')}
                  </Button>
                  {level === 0 &&
                    hasFlag('/account/billing?payment_method=lock') && (
                      <Button variant="alternative" onClick={openBillings}>
                        <DebugPin
                          title="/account/billing?payment_method=lock"
                          color="orange"
                        />
                        {t('utility.lock-tokens')}
                      </Button>
                    )}
                </div>
              )}
            </div>
          </div>
          <div className="h-full w-px border-r border-white/20 max-md:hidden"></div>
          <div className="h-px w-full border-t border-white/20 md:hidden"></div>
          <div>
            <h3 className="mb-3 md:mb-9 md:w-40">{t('utility.current-sub')}</h3>
            <div className="text-nowrap text-4xl">
              {title}
              {level > 0 && (
                <span className="ms-3 text-base text-white/60">
                  / {plan?.periodicity.toLowerCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      {pricingTableModal}
      {unlockModal}
    </Card>
  );
}
