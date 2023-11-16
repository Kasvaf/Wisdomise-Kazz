import { Trans, useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useCallback, useEffect, useMemo } from 'react';
import Button from 'shared/Button';
import { addComma } from 'utils/numbers';
import Card from 'shared/Card';
import { type SubscriptionPlan } from 'api/types/subscription';
import { INVESTMENT_FE } from 'config/constants';
import { useUpdateTokenBalanceMutation } from 'api/defi';
import { useAccountQuery, useSubmitTokenPayment } from 'api';

interface Props {
  plan: SubscriptionPlan;
  setDone: (state: boolean) => void;
}

export default function TokenCheckout({ plan, setDone }: Props) {
  const { data: account } = useAccountQuery();
  const { mutateAsync } = useSubmitTokenPayment();
  const { mutateAsync: updateBalance } = useUpdateTokenBalanceMutation();

  const updateTokenBalance = useCallback(async () => {
    await updateBalance();
  }, [updateBalance]);

  useEffect(() => {
    void updateTokenBalance();
  }, [updateTokenBalance]);

  const openInvestmentPanel = useCallback(() => {
    window.location.href = INVESTMENT_FE;
  }, []);
  const { t } = useTranslation('billing');

  const canSubscribe = useMemo(
    () => plan.wsdm_token_hold < (account?.wsdm_balance ?? 0),
    [plan, account],
  );

  const submitTokenPayment = async () => {
    await mutateAsync({
      amount_paid: 0,
      subscription_plan_key: plan.key,
    });
    setDone(true);
  };

  return (
    <Card className="flex flex-col items-center gap-6 text-center">
      <h3 className="flex w-full items-center justify-between">
        {plan.name}
        <Button
          className="mt-2 !p-2"
          variant="secondary"
          onClick={updateTokenBalance}
        >
          {t('token-modal.refresh')}
        </Button>
      </h3>
      <div className="flex items-center justify-center gap-10">
        <div>
          <div className="mb-5 text-4xl">{addComma(plan.wsdm_token_hold)}</div>
          <div className="text-sm opacity-50">
            <Trans i18nKey="token-modal.token-name" ns="billing" />
          </div>
        </div>
        <div className="h-16 w-px border-r border-white/50"></div>
        <div className="text-center">
          <div
            className={clsx(
              'mb-5 text-4xl',
              canSubscribe ? 'text-green-400' : 'text-red-400',
            )}
          >
            {addComma(account?.wsdm_balance ?? 0)}
          </div>
          <div className="text-sm opacity-50">
            {t('token-modal.your-balance')}
          </div>
        </div>
      </div>
      <Card className="!bg-black/80">
        <p className="text-sm text-white/80">{t('token-modal.description')}</p>
      </Card>
      <div className="max-w-[18rem]">
        <Button
          onClick={submitTokenPayment}
          disabled={!canSubscribe}
          className="mb-6 w-full"
        >
          {t('token-modal.activate-subscription')}
        </Button>
        <Button
          disabled={canSubscribe}
          className="w-full"
          onClick={openInvestmentPanel}
        >
          {t('token-modal.purchase-token')}
        </Button>
      </div>
    </Card>
  );
}
