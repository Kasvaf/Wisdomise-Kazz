import { Trans, useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useCallback, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { notification } from 'antd';
import Button from 'shared/Button';
import { addComma } from 'utils/numbers';
import Card from 'shared/Card';
import { type SubscriptionPlan } from 'api/types/subscription';
import { useSubmitTokenPayment } from 'api';
import { useLocking } from 'modules/account/PageToken/web3/locking/useLocking';
import { useWsdmBalance } from 'modules/account/PageToken/web3/wsdm/contract';
import { useLockingRequirementQuery } from 'api/defi';
import { useReadLockedBalance } from 'modules/account/PageToken/web3/locking/contract';
import useModal from 'shared/useModal';
import TransactionConfirmedModalContent from 'modules/account/PageBilling/paymentMethods/Token/TransactionConfirmedModalContent';
import BuyWSDM from 'modules/account/PageToken/Balance/BuyWSDM';
// eslint-disable-next-line import/max-dependencies
import { unwrapErrorMessage } from 'utils/error';

interface Props {
  invoiceKey?: string;
  plan: SubscriptionPlan;
  setDone: (state: boolean) => void;
}

export default function TokenCheckout({ plan, setDone, invoiceKey }: Props) {
  const { t } = useTranslation('billing');
  const { mutateAsync } = useSubmitTokenPayment();
  const { data: lockedBalance } = useReadLockedBalance();
  const { handleLocking, lockTrxReceipt, isLoading, isLocking } = useLocking();
  const {
    data: wsdmBalance,
    refetch: updateBalance,
    isLoading: balanceIsLoading,
  } = useWsdmBalance();
  const { address } = useAccount();
  const { data: generalLockingRequirement } = useLockingRequirementQuery(
    plan.price,
  );
  const { data: userLockingRequirement } = useLockingRequirementQuery(
    plan.price,
    address,
  );
  const [Modal, showModal] = useModal(TransactionConfirmedModalContent, {
    width: 800,
    closable: false,
    maskClosable: false,
  });

  useEffect(() => {
    void showModal({});
  }, [showModal]);

  const canSubscribe = useMemo(
    () =>
      (generalLockingRequirement?.requirement_locking_amount ?? 0) <
      Number(wsdmBalance?.value) +
        (userLockingRequirement?.current_locking_amount ?? 0),
    [
      generalLockingRequirement?.requirement_locking_amount,
      userLockingRequirement?.current_locking_amount,
      wsdmBalance?.value,
    ],
  );

  const activate = async () => {
    await ((userLockingRequirement?.requirement_locking_amount ?? 0) <= 0
      ? submitTokenPayment()
      : handleLocking(userLockingRequirement?.requirement_locking_amount ?? 0));
  };

  const submitTokenPayment = useCallback(async () => {
    mutateAsync(
      invoiceKey
        ? { invoice_key: invoiceKey }
        : {
            amount_paid: 0,
            subscription_plan_key: plan.key,
          },
    )
      .then(() => setDone(true))
      .catch(error =>
        notification.error({ message: unwrapErrorMessage(error) }),
      );
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
      <div className="flex items-center justify-center gap-6">
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
              {userLockingRequirement?.current_locking_amount?.toLocaleString()}
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
        {canSubscribe ? (
          <Button
            variant="primary-purple"
            disabled={isLoading}
            loading={isLoading}
            onClick={activate}
            className="mb-6 w-full"
          >
            {t('token-modal.activate-subscription')}
          </Button>
        ) : (
          <BuyWSDM className="w-full" />
        )}
      </div>
      {isLocking && Modal}
    </Card>
  );
}
