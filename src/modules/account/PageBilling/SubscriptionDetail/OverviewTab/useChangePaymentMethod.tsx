import { notification } from 'antd';
import Button from 'modules/shared/Button';
import useModal from 'modules/shared/useModal';
import { useChangePaymentMethodMutation } from 'api';
import { unwrapErrorMessage } from 'utils/error';
import { type PaymentMethod } from 'api/types/subscription';
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

  const clickedPayment = changePaymentMethod.variables?.payment_method;

  return (
    <div className="flex flex-col items-center">
      <p className="text-lg font-semibold">Change Payment Method</p>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <Button
          size="small"
          loading={clickedPayment === 'FIAT' && changePaymentMethod.isLoading}
          onClick={() => handleChangePayment('FIAT')}
        >
          <div className="flex items-center gap-2">
            <SIcon />
            Fiat
          </div>
        </Button>
        <Button
          size="small"
          loading={clickedPayment === 'CRYPTO' && changePaymentMethod.isLoading}
          onClick={() => handleChangePayment('CRYPTO')}
        >
          <div className="flex items-center gap-2">
            <CryptoPaymentIcon />
            Crypto
          </div>
        </Button>
        <Button
          size="small"
          loading={clickedPayment === 'TOKEN' && changePaymentMethod.isLoading}
          onClick={() => handleChangePayment('TOKEN')}
        >
          <div className="flex items-center gap-2">
            <TokenIcon />
            Wisdomise Token (tWSDM)
          </div>
        </Button>
      </div>
    </div>
  );
}
