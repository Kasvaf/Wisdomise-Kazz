import { Trans, useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useCallback, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import Button from 'shared/Button';
import { addComma } from 'utils/numbers';
import Card from 'shared/Card';
import { type SubscriptionPlan } from 'api/types/subscription';
import { INVESTMENT_FE } from 'config/constants';
import { useSubmitTokenPayment } from 'api';
import { useLocking } from 'modules/account/PageToken/web3/locking/useLocking';
import { useWsdmBalance } from 'modules/account/PageToken/web3/wsdm/contract';
import { useLockingRequirementQuery } from 'api/defi';
import { useReadLockedBalance } from 'modules/account/PageToken/web3/locking/contract';

interface Props {
  invoiceKey?: string;
  plan: SubscriptionPlan;
  setDone: (state: boolean) => void;
}

export default function TokenCheckout({ plan, setDone, invoiceKey }: Props) {
  const { t } = useTranslation('billing');
  const { mutateAsync } = useSubmitTokenPayment();
  const { data: lockedBalance } = useReadLockedBalance();
  const { handleLocking, lockTrxReceipt, isLoading } = useLocking();
  const {
    data: wsdmBalance,
    refetch: updateBalance,
    isLoading: balanceIsLoading,
  } = useWsdmBalance();
  const { address } = useAccount();
  const { data: generalLockingRequirement } = useLockingRequirementQuery(
    plan.price,
  );
  const { data: lockingRequirement } = useLockingRequirementQuery(
    plan.price,
    address,
  );

  const openInvestmentPanel = () => {
    window.open(INVESTMENT_FE, '_blank');
  };

  const canSubscribe = useMemo(
    () =>
      (generalLockingRequirement?.requirement_locking_amount ?? 0) <
      ((wsdmBalance?.value ?? 0n) + (lockedBalance ?? 0n)) / 10n ** 6n,
    [
      generalLockingRequirement?.requirement_locking_amount,
      lockedBalance,
      wsdmBalance?.value,
    ],
  );

  const activate = async () => {
    await (lockingRequirement?.requirement_locking_amount === 0
      ? submitTokenPayment()
      : handleLocking(lockingRequirement?.requirement_locking_amount ?? 0));
  };

  const submitTokenPayment = useCallback(async () => {
    await mutateAsync(
      invoiceKey
        ? { invoice_key: invoiceKey }
        : {
            amount_paid: 0,
            subscription_plan_key: plan.key,
          },
    );
    setDone(true);
  }, [invoiceKey, mutateAsync, plan.key, setDone]);

  useEffect(() => {
    if (lockTrxReceipt?.status === 'success') {
      void submitTokenPayment();
    }
  }, [lockTrxReceipt, submitTokenPayment]);

  return (
    <Card className="flex flex-col items-center gap-6 text-center">
      <h3 className="flex w-full items-center justify-between text-xl">
        {plan.name}
        <Button
          className="mt-2 !p-2"
          variant="secondary"
          disabled={balanceIsLoading}
          onClick={() => updateBalance()}
        >
          {t('token-modal.refresh')}
        </Button>
      </h3>
      <div className="flex items-center justify-center gap-10">
        <div>
          <div className="mb-5 text-4xl">
            {addComma(generalLockingRequirement?.requirement_locking_amount)}
          </div>
          <div className="text-sm opacity-50">
            <Trans i18nKey="token-modal.token-name" ns="billing" />
          </div>
        </div>
        <div className="h-16 w-px border-r border-white/50"></div>

        {(lockedBalance ?? 0n) > 0 ? (
          <div className="text-center">
            <div
              className={clsx(
                'mb-5 text-4xl',
                canSubscribe ? 'text-green-400' : 'text-red-400',
              )}
            >
              {(Number(lockedBalance) / 10 ** 6).toLocaleString()}
            </div>
            <div className="text-sm opacity-50">Already Locked Balance</div>
          </div>
        ) : (
          <div className="text-center">
            <div
              className={clsx(
                'mb-5 text-4xl',
                canSubscribe ? 'text-green-400' : 'text-red-400',
              )}
            >
              {addComma(
                Number(wsdmBalance?.value ?? 0) /
                  10 ** (wsdmBalance?.decimals ?? 1),
              )}
            </div>
            <div className="text-sm opacity-50">
              {t('token-modal.your-balance')}
            </div>
          </div>
        )}
      </div>
      <Card className="!bg-black/80">
        <p className="text-sm text-white/80">{t('token-modal.description')}</p>
      </Card>
      <div className="max-w-[18rem]">
        <Button
          variant="primary-purple"
          disabled={!canSubscribe || isLoading}
          loading={isLoading}
          onClick={activate}
          className="mb-6 w-full"
        >
          {t('token-modal.activate-subscription')}
        </Button>
        <Button
          disabled={isLoading}
          className="w-full"
          onClick={openInvestmentPanel}
        >
          {t('token-modal.purchase-token')}
        </Button>
      </div>
      {isLoading && (
        <p className="text-xl text-yellow-400">
          Please do not refresh or close the page as we proceed your
          transactions
        </p>
      )}
    </Card>
  );
}
