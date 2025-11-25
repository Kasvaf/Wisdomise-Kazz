import { notification } from 'antd';
import dayjs from 'dayjs';
import { Trans, useTranslation } from 'react-i18next';
import { useAccountQuery } from 'services/rest';
import useModal from 'shared/useModal';
import CryptoPaymentModalContent from '../../paymentMethods/Crypto';
import TokenPaymentModalContent from '../../paymentMethods/Token';
import InfoBadge from './InfoBadge';

export default function PendingInvoice() {
  const account = useAccountQuery();
  const { t } = useTranslation('billing');

  const [CryptoPaymentModal, openCryptoPaymentModal] = useModal(
    CryptoPaymentModalContent,
    { fullscreen: true, destroyOnClose: true },
  );
  const [TokenPaymentModal, openTokenPaymentModal] = useModal(
    TokenPaymentModalContent,
    { fullscreen: true, destroyOnClose: true },
  );

  const pendingInvoice = account.data?.subscription_item?.pending_invoice;

  const payPendingInvoice = () => {
    if (!pendingInvoice) return;
    const payMethod = pendingInvoice?.payment_method;

    switch (payMethod) {
      case 'CRYPTO': {
        pendingInvoice.subscription_plan.price = pendingInvoice.amount_paid;
        void openCryptoPaymentModal({
          invoiceKey: pendingInvoice.key,
          plan: pendingInvoice.subscription_plan,
        });
        break;
      }
      case 'FIAT': {
        if (pendingInvoice.stripe_payment_link) {
          window.location.href = pendingInvoice.stripe_payment_link;
        } else {
          notification.error({
            message: t('pricing-card.notification-call-support'),
          });
        }
        break;
      }
      case 'TOKEN': {
        pendingInvoice.subscription_plan.price = pendingInvoice.amount_paid;
        void openTokenPaymentModal({
          invoiceKey: pendingInvoice.key,
          plan: pendingInvoice.subscription_plan,
        });
        break;
      }
    }
  };

  return (
    <div>
      {pendingInvoice && (
        <>
          <Trans
            i18nKey="subscription-details.overview.current-plan.pending-invoice"
            ns="billing"
          >
            <p>
              You payment status is
              <InfoBadge
                type="warning"
                value1="Pending"
                value2={dayjs(pendingInvoice.due_date ?? 0).fromNow(true)}
              />
            </p>
          </Trans>
          <button
            className="mt-3 w-56 rounded-xl bg-[linear-gradient(235deg,#615298_13.43%,#42427B_77.09%)] px-8 py-4 font-medium text-white leading-none"
            onClick={payPendingInvoice}
          >
            {t('subscription-details.overview.current-plan.pay-now')}
          </button>
        </>
      )}
      {CryptoPaymentModal}
      {TokenPaymentModal}
    </div>
  );
}
