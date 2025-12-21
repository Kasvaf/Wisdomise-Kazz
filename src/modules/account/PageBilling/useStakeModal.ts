import TokenPaymentModalContent from 'modules/account/PageBilling/paymentMethods/Token';
import { usePlansQuery } from 'services/rest';
import useModal from 'shared/useModal';

export function useStakeModal() {
  const plans = usePlansQuery();
  const plan = plans.data?.results[0];

  const [stakeModal, openTokenPaymentModal] = useModal(
    TokenPaymentModalContent,
    { fullscreen: true, destroyOnClose: true },
  );

  const openStakeModal = () => {
    if (plan) {
      void openTokenPaymentModal({ plan });
    }
  };

  return { stakeModal, openStakeModal };
}
