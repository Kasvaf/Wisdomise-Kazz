import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useAccountQuery, useStripePaymentMethodsQuery } from 'api';
import { type PaymentMethod } from 'api/types/subscription';
import useModal from 'modules/shared/useModal';
import CryptoPaymentModalContent from '../../paymentMethods/Crypto';
import TokenPaymentModalContent from '../../paymentMethods/Token';
import useChangePaymentMethodModal from './useChangePaymentMethod';

export default function BillingActions() {
  const account = useAccountQuery();
  const { t } = useTranslation('billing');
  const stripePaymentMethod = useStripePaymentMethodsQuery();
  const [PaymentMethodModal, openPaymentMethodModal] =
    useChangePaymentMethodModal();
  const [CryptoPaymentModal, openCryptoPaymentModal] = useModal(
    CryptoPaymentModalContent,
    { fullscreen: true, destroyOnClose: true },
  );
  const [TokenPaymentModal, openTokenPaymentModal] = useModal(
    TokenPaymentModalContent,
    { fullscreen: true, destroyOnClose: true },
  );

  const pendingInvoice = account.data?.subscription_item?.pending_invoice;
  const subItem = account.data?.subscription_item;
  const paymentMethod =
    subItem?.next_subs_item?.payment_method || subItem?.payment_method;

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

  const paymentMethodText: Record<PaymentMethod, string> = {
    CRYPTO: 'Crypto',
    FIAT: 'Fiat',
    TOKEN: 'Wisdomise Token (tWSDM)',
    MANUAL: 'Manual',
  };

  return (
    <>
      <section className="mt-8">
        <h2 className="mb-4 text-base font-semibold text-white">
          {t('subscription-details.overview.billing-actions')}
        </h2>

        <div className="text-base text-white/70">
          {pendingInvoice && (
            <Trans
              ns="billing"
              i18nKey="subscription-details.overview.pending-invoice"
            >
              <div>
                <span className="font-semibold text-white">
                  You have 1 pending invoice.
                </span>
                <button
                  onClick={payPendingInvoice}
                  className="ml-2 text-blue-600"
                >
                  Pay Now
                </button>
              </div>
            </Trans>
          )}

          <Trans
            ns="billing"
            i18nKey="subscription-details.overview.pay-method"
          >
            <div>
              Next Payment method:{' '}
              <strong className="text-white">
                {{
                  payMethod: paymentMethod && paymentMethodText[paymentMethod],
                }}
                .
              </strong>
              <button
                onClick={openPaymentMethodModal}
                className={clsx(
                  'ml-2 text-blue-600',
                  !subItem?.next_subs_item && 'hidden',
                )}
              >
                Change payment method
              </button>
            </div>
          </Trans>
          {stripePaymentMethod.data?.data[0]?.card &&
            subItem?.next_subs_item?.payment_method === 'FIAT' && (
              <p>
                <Trans
                  i18nKey="subscription-details.overview.card"
                  ns="billing"
                >
                  Future charges will be applied to the card
                  <strong className="text-white">
                    ****{{ last4: stripePaymentMethod.data.data[0].card.last4 }}
                  </strong>
                  .
                </Trans>

                <Link
                  className="ml-2 text-blue-600"
                  to="/account/billing/change-stripe-card-info"
                >
                  {t('stripe.change-card-info.title')}
                </Link>
              </p>
            )}

          <p>
            <Trans
              ns="billing"
              i18nKey="subscription-details.overview.billing-email"
            >
              Billing emails are sent to
              <strong className="text-white">
                {{ email: account.data?.email ?? '' }}
              </strong>
              .
            </Trans>
          </p>
        </div>
      </section>
      {PaymentMethodModal}
      {CryptoPaymentModal}
      {TokenPaymentModal}
    </>
  );
}
