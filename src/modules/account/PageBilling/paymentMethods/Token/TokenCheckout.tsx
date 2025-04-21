/* eslint-disable import/max-dependencies */
import { Trans, useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useCallback, useEffect } from 'react';
import { notification } from 'antd';
import { useDisconnect } from 'wagmi';
import { addComma } from 'utils/numbers';
import Card from 'shared/Card';
import { type SubscriptionPlan } from 'api/types/subscription';
import { useSubmitTokenPayment } from 'api';
import { useLocking } from 'modules/account/PageToken/web3/locking/useLocking';
import { useWsdmBalance } from 'modules/account/PageToken/web3/wsdm/contract';
import { useLockingRequirementQuery, useLockingStateQuery } from 'api/defi';
import { useReadLockedBalance } from 'modules/account/PageToken/web3/locking/contract';
import useModal from 'shared/useModal';
import TransactionConfirmedModalContent from 'modules/account/PageBilling/paymentMethods/Token/TransactionConfirmedModalContent';
import BuyWSDM from 'modules/account/PageToken/Balance/BuyWSDM';
import { unwrapErrorMessage } from 'utils/error';
import { Button } from 'shared/v1-components/Button';
import { track } from 'config/segment';

interface Props {
  countdown: number;
  invoiceKey?: string;
  plan: SubscriptionPlan;
  setDone: (state: boolean) => void;
}

export default function TokenCheckout({
  plan,
  setDone,
  invoiceKey,
  countdown,
}: Props) {
  const { t } = useTranslation('billing');
  const { mutateAsync } = useSubmitTokenPayment();
  const { data: lockedBalance, refetch } = useReadLockedBalance();
  const { startLocking, isLoading, isLocking, lockTrxReceipt } = useLocking();
  const {
    data: wsdmBalance,
    refetch: updateBalance,
    isLoading: balanceIsLoading,
  } = useWsdmBalance();
  const { data: generalLockingRequirement } = useLockingRequirementQuery(
    plan.price,
  );
  const { refetch: lockStateRefetch } = useLockingStateQuery();
  const [Modal, showModal] = useModal(TransactionConfirmedModalContent, {
    width: 800,
    closable: false,
    maskClosable: false,
  });
  const { disconnect } = useDisconnect();

  useEffect(() => {
    void showModal({});
  }, [showModal]);

  const canStake =
    Number(wsdmBalance?.value) >
    (generalLockingRequirement?.requirement_locking_amount ?? 0);

  const canSubscribe =
    (generalLockingRequirement?.requirement_locking_amount ?? 0) <=
    Number(lockedBalance) / 10 ** 6;

  const stakeRemaining =
    (generalLockingRequirement?.requirement_locking_amount ?? 0) -
    Number(lockedBalance) / 10 ** 6;

  const activate = async () => {
    void submitTokenPayment().then(() => track('stake_completed'));
  };

  const lock = () => {
    void startLocking(stakeRemaining, countdown);
  };

  const submitTokenPayment = useCallback(async () => {
    await lockStateRefetch();
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
  }, [invoiceKey, lockStateRefetch, mutateAsync, plan.key, setDone]);

  useEffect(() => {
    if (lockTrxReceipt?.status === 'success') {
      void refetch();
    }
  }, [lockTrxReceipt, refetch, submitTokenPayment]);

  return (
    <Card className="flex flex-col items-center gap-6 text-center">
      <h3 className="flex w-full items-center justify-between gap-2 text-xl">
        {plan.name}
        <Button
          size="xs"
          className="ml-auto"
          variant="outline"
          onClick={() => disconnect()}
        >
          Disconnect
        </Button>
        <Button
          size="xs"
          variant="outline"
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
              {addComma(Number(lockedBalance) / 10 ** 6)}
            </div>
            <div className="text-sm opacity-50">Already Staked Balance</div>
          </div>
        ) : (
          <div className="text-center">
            <div
              className={clsx(
                'mb-5 text-4xl',
                canSubscribe || canStake ? 'text-green-400' : 'text-red-400',
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
      {(lockedBalance ?? 0n) > 0 && (
        <div>
          Congratulation!
          <br />
          You now earn your share of 50% of Wisdomise&apos;s revenue
          {!canSubscribe && (
            <span>
              <br />
              increase your stake up to 1,000$ to has access to all over product
              <br />
              (Stake {addComma(stakeRemaining)} More $WSDM to Access Wise club)
            </span>
          )}
        </div>
      )}
      <div className="max-w-[18rem]">
        {canSubscribe ? (
          <Button
            disabled={isLoading}
            loading={isLoading}
            onClick={activate}
            className="mb-6 w-full"
          >
            Activate Wise Club
          </Button>
        ) : canStake ? (
          <Button
            disabled={isLoading}
            loading={isLoading}
            onClick={lock}
            className="mb-6 w-full"
          >
            Stake Now
          </Button>
        ) : (
          <BuyWSDM className="w-full" />
        )}
      </div>
      {isLocking && Modal}
    </Card>
  );
}
