import { Trans, useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { notification } from 'antd';
import { Link } from 'react-router-dom';
import {
  useAccountQuery,
  useHasFlag,
  useStripePaymentMethodsQuery,
  useSubscription,
  useSubscriptionMutation,
} from 'api';
import { unwrapErrorMessage } from 'utils/error';
import { paymentMethodText } from 'modules/account/PageBilling/SubscriptionDetail/OverviewTab/CurrentPlan';
import useChangePaymentMethodModal from './useChangePaymentMethod';
import InfoBadge from './InfoBadge';

export default function NextPlan() {
  const account = useAccountQuery();
  const { t } = useTranslation('billing');
  const [PaymentMethodModal, openPaymentMethodModal] =
    useChangePaymentMethodModal();
  const { currentPeriodEnd, plan } = useSubscription();
  const subscriptionMutation = useSubscriptionMutation();
  const stripePaymentMethod = useStripePaymentMethodsQuery();
  const hasFlag = useHasFlag();

  const handleToggleAutoRenew = async (turnOn?: boolean) => {
    try {
      await subscriptionMutation.mutateAsync({
        subscription_plan_key: turnOn ? plan?.key ?? null : null,
      });
      notification.success({
        message: `Auto-Renew ${turnOn ? 'enabled' : 'canceled'} successfully`,
      });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  const subItem = account.data?.subscription_item;
  const isAutoRenewEnabled = !subItem?.cancel_at_period_end;
  const paymentMethod = subItem?.payment_method;
  const isFiat = paymentMethod === 'FIAT';

  return (
    <>
      <section className="flex flex-col gap-3">
        <div>
          {t('subscription-details.overview.next-plan.pay-method')}
          {paymentMethod && (
            <InfoBadge value1={paymentMethodText[paymentMethod]} />
          )}

          {hasFlag('/account/billing?change_payment_method') && (
            <button
              onClick={openPaymentMethodModal}
              className="text-sm text-[#34A3DA] underline decoration-current underline-offset-4"
            >
              {t('subscription-details.overview.next-plan.change-pay-method')}
            </button>
          )}
        </div>
        {isAutoRenewEnabled && (
          <>
            {paymentMethod === 'CRYPTO' && (
              <div>
                <Trans
                  i18nKey="subscription-details.overview.next-plan.in-order-to-renew"
                  ns="billing"
                >
                  In order to renew, you will have to send the transaction again
                  on
                  <InfoBadge
                    value1={dayjs(currentPeriodEnd ?? 0).format('MMMM D, YYYY')}
                  />
                </Trans>
              </div>
            )}
            {paymentMethod === 'TOKEN' && (
              <p>
                {t(
                  'subscription-details.overview.next-plan.automatically-renew',
                )}
              </p>
            )}

            {isFiat && stripePaymentMethod.data?.data[0]?.card && (
              <p>
                <Trans
                  ns="billing"
                  i18nKey="subscription-details.overview.next-plan.card"
                >
                  Future charges will be applied to the card
                  <InfoBadge
                    value1={`**** ${stripePaymentMethod.data.data[0].card.last4}`}
                  />
                </Trans>
                <Link
                  className="text-[#34A3DA] underline decoration-current underline-offset-4"
                  to="/account/billing/change-stripe-card-info"
                >
                  {t('stripe.change-card-info.title')}
                </Link>
              </p>
            )}

            <div>
              <button
                onClick={() => handleToggleAutoRenew(false)}
                className="text-sm text-[#da3434] underline decoration-current underline-offset-4 disabled:animate-pulse disabled:text-white/40"
                disabled={subscriptionMutation.isPending}
              >
                {t('subscription-details.overview.next-plan.cancel-btn')}
              </button>
            </div>
          </>
        )}

        {!isAutoRenewEnabled && (
          <Trans
            ns="billing"
            i18nKey="subscription-details.overview.next-plan.canceled"
          >
            <p>
              Your subscription will not renew automatically.
              <button
                onClick={() => handleToggleAutoRenew(true)}
                className="ml-2 text-sm text-[#34A3DA] underline underline-offset-4 disabled:animate-pulse disabled:text-white/40"
                disabled={subscriptionMutation.isPending}
              >
                Turn On Auto-Renew
              </button>
            </p>
          </Trans>
        )}
      </section>
      {PaymentMethodModal}
    </>
  );
}
