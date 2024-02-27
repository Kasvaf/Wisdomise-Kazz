import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAccountQuery, useChangePaymentMethodMutation } from 'api';
import { type PaymentMethod } from 'api/types/subscription';
import { unwrapErrorMessage } from 'utils/error';
import Button from 'shared/Button';
import useModal from 'shared/useModal';
import { ReactComponent as SIcon } from '../../images/s-icon.svg';
import { ReactComponent as CryptoPaymentIcon } from '../../images/crypto-pay-icon.svg';
import { ReactComponent as TokenIcon } from '../../images/token.svg';

export default function useChangePaymentMethodModal() {
  const [Component, open] = useModal(ChangePaymentMethod, {
    centered: true,
    width: 550,
  });

  return [Component, open] as const;
}

function ChangePaymentMethod({ onResolve }: { onResolve: VoidFunction }) {
  const { t } = useTranslation('billing');
  const account = useAccountQuery();
  const changePaymentMethod = useChangePaymentMethodMutation();

  const handleChangePayment = async (payment: PaymentMethod) => {
    try {
      await changePaymentMethod.mutateAsync({ payment_method: payment });
      notification.success({ message: 'Payment method changed successfully.' });
      onResolve();
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  const nextSub = account.data?.subscription_item?.next_subs_item;
  const clickedPayment = changePaymentMethod.variables?.payment_method;

  return (
    <div className="flex flex-col items-center">
      <p className="text-lg font-semibold">{t('change-pay-method.title')}</p>
      <p className="mt-1 font-normal">{t('change-pay-method.sub-title')}</p>

      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {nextSub?.payment_method !== 'FIAT' && (
          <Button
            size="small"
            loading={clickedPayment === 'FIAT' && changePaymentMethod.isLoading}
            onClick={() => handleChangePayment('FIAT')}
          >
            <div className="flex items-center gap-2">
              <SIcon />
              {t('change-pay-method.fiat')}
            </div>
          </Button>
        )}

        {nextSub?.payment_method !== 'CRYPTO' && (
          <Button
            size="small"
            loading={
              clickedPayment === 'CRYPTO' && changePaymentMethod.isLoading
            }
            onClick={() => handleChangePayment('CRYPTO')}
          >
            <div className="flex items-center gap-2">
              <CryptoPaymentIcon />
              {t('change-pay-method.crypto')}
            </div>
          </Button>
        )}

        {nextSub?.subscription_plan.periodicity === 'YEARLY' &&
          nextSub.payment_method !== 'TOKEN' && (
            <Button
              size="small"
              loading={
                clickedPayment === 'TOKEN' && changePaymentMethod.isLoading
              }
              onClick={() => handleChangePayment('TOKEN')}
            >
              <div className="flex items-center gap-2">
                <TokenIcon />
                {t('change-pay-method.token')}
              </div>
            </Button>
          )}
      </div>
    </div>
  );
}
