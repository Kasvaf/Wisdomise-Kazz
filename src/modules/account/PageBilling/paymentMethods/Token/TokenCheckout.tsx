import { Trans, useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useCallback } from 'react';
import { notification } from 'antd';
import { useDisconnect } from 'wagmi';
import { addComma } from 'utils/numbers';
import Card from 'shared/Card';
import { type SubscriptionPlan } from 'api/types/subscription';
import { useSubmitTokenPayment } from 'api';
import { useLockWithApprove } from 'modules/account/PageToken/web3/locking/useLocking';
import { useWSDMBalance } from 'modules/account/PageToken/web3/wsdm/contract';
import { useLockingRequirementQuery, useLockingStateQuery } from 'api/defi';
import { useReadLockedBalance } from 'modules/account/PageToken/web3/locking/contract';
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

export default function TokenCheckout({ plan, setDone, invoiceKey }: Props) {
  const { t } = useTranslation('billing');
  const { mutateAsync, isPending: paymentIsPending } = useSubmitTokenPayment();
  const { data: lockedBalance, refetch: readLockedBalance } =
    useReadLockedBalance();
  const {
    lockWithApprove,
    approveIsPending,
    approveIsWaiting,
    lockingIsPending,
    lockingIsWaiting,
  } = useLockWithApprove();
  const {
    data: wsdmBalance,
    refetch: updateBalance,
    isLoading: balanceIsLoading,
  } = useWSDMBalance();
  const { data: generalLockingRequirement } = useLockingRequirementQuery(
    plan.price,
  );
  const { refetch: lockStateRefetch, isFetching: lockStateIsFetching } =
    useLockingStateQuery();
  const { disconnect } = useDisconnect();

  const canStake =
    Number(wsdmBalance?.value ?? 0) / 10 ** (wsdmBalance?.decimals ?? 1) >
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
    void lockWithApprove(BigInt(stakeRemaining * 10 ** 6)).then(() =>
      readLockedBalance(),
    );
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
          loading={balanceIsLoading}
          onClick={() => updateBalance()}
        >
          {t('token-modal.refresh')}
        </Button>
      </h3>
      <div className="flex justify-center gap-6">
        <div>
          <div className="mb-5 text-4xl">
            {addComma(generalLockingRequirement?.requirement_locking_amount)}
          </div>
          <div className="text-sm opacity-50">
            <Trans i18nKey="token-modal.token-name" ns="billing" />
            <p className="mt-1 text-xs">Polygon Network</p>
          </div>
        </div>
        <div className="h-16 w-px border-r border-v1-border-secondary"></div>

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
      <div className="mt-6 w-72 mobile:w-full">
        {canSubscribe ? (
          <Button
            loading={paymentIsPending || lockStateIsFetching}
            onClick={activate}
            className="w-full"
          >
            Activate Wise Club
          </Button>
        ) : canStake ? (
          <Button
            loading={
              approveIsPending ||
              approveIsWaiting ||
              lockingIsPending ||
              lockingIsWaiting
            }
            onClick={lock}
            className="w-full"
          >
            {approveIsPending
              ? 'Waiting for approval signature...'
              : approveIsWaiting
                ? 'Approval transaction is confirming...'
                : lockingIsPending
                  ? 'Waiting for staking signature...'
                  : lockingIsWaiting
                    ? 'Staking transaction is confirming...'
                    : 'Stake Now'}
          </Button>
        ) : (
          <BuyWSDM className="w-full" />
        )}
      </div>
    </Card>
  );
}
