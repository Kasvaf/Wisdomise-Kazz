import useModal from 'shared/useModal';
import TokenPaymentModalContent from 'modules/account/PageBilling/paymentMethods/Token';
import { usePlansQuery } from 'api';

export function useVipModal() {
  const plans = usePlansQuery();
  const plan = plans.data?.results[0];

  const [tokenPaymentModal, openTokenPaymentModal] = useModal(
    TokenPaymentModalContent,
    { fullscreen: true, destroyOnClose: true },
  );

  const openVipModal = () => {
    if (plan) {
      void openTokenPaymentModal({ plan });
    }
  };

  return { tokenPaymentModal, openVipModal };
}
