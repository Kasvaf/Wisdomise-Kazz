import { Trans, useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { notification } from 'antd';
import { Link } from 'react-router-dom';
import {
  useAccountQuery,
  useStripePaymentMethodsQuery,
  useSubscription,
  useSubscriptionMutation,
} from 'api';
import useModal from 'shared/useModal';
import { type PaymentMethod } from 'api/types/subscription';
import { unwrapErrorMessage } from 'utils/error';
import Button from 'shared/Button';
import PricingTable from '../../PricingTable';
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
  const [PricingTableMod, openPricingTable] = useModal(PricingTable, {
    width: 1200,
  });

  const onCancelPlan = async () => {
    try {
      await subscriptionMutation.mutateAsync({ subscription_plan_key: null });
      notification.success({ message: 'Next plan canceled successfully' });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  const subItem = account.data?.subscription_item;
  const nextSubs = subItem?.next_subs_item;
  const paymentMethod = subItem?.next_subs_item?.payment_method;
  const isFiat = paymentMethod === 'FIAT';

  return (
    <div className="mt-10 border-t border-white/20 pt-10 mobile:mt-5 mobile:pt-5">
      <section className="flex flex-col gap-3">
        <h2 className="mb-1 text-xl font-semibold text-white/20">
          {t('subscription-details.overview.next-plan.title')}
        </h2>

        {nextSubs && (
          <>
            <div className="flex flex-wrap items-center">
              <Trans
                ns="billing"
                i18nKey="subscription-details.overview.next-plan.your-subs"
              >
                Your subscription plan is
                <InfoBadge
                  value1={nextSubs.subscription_plan.name}
                  value2={nextSubs.subscription_plan.periodicity.toLowerCase()}
                />
              </Trans>

              <button
                onClick={() => openPricingTable({ isUpdate: true })}
                className="text-sm text-[#34A3DA] underline decoration-current underline-offset-4"
              >
                {t('subscription-details.overview.btn-change-plan')}
              </button>
            </div>

            <div>
              {t('subscription-details.overview.next-plan.pay-method')}
              {paymentMethod && (
                <InfoBadge value1={paymentMethodText[paymentMethod]} />
              )}
              <button
                onClick={openPaymentMethodModal}
                className="text-sm text-[#34A3DA] underline decoration-current underline-offset-4"
              >
                {t('subscription-details.overview.next-plan.change-pay-method')}
              </button>
            </div>

            <div>
              {paymentMethod === 'CRYPTO' && (
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
              )}
              {paymentMethod === 'TOKEN' &&
                t(
                  'subscription-details.overview.next-plan.automatically-renew',
                )}

              {isFiat && (
                <div className="flex flex-col gap-3">
                  {stripePaymentMethod.data?.data[0]?.card && (
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
                  <p>
                    <Trans
                      ns="billing"
                      i18nKey="subscription-details.overview.next-plan.charging"
                    >
                      Charging your credit card
                      <InfoBadge
                        value1={'$' + (plan?.price.toString() || '')}
                      />
                    </Trans>
                  </p>
                </div>
              )}
            </div>

            <Button
              variant="link"
              onClick={onCancelPlan}
              loading={subscriptionMutation.isLoading}
              className="w-fit !p-0 !text-base !text-[#F14056]/80 underline underline-offset-4"
            >
              {t('subscription-details.overview.next-plan.cancel-btn')}
            </Button>
          </>
        )}

        {!nextSubs && (
          <Trans
            ns="billing"
            i18nKey="subscription-details.overview.next-plan.canceled"
          >
            <p>
              Your next plan has been canceled.
              <button
                onClick={() => openPricingTable({ isRenew: true })}
                className="ml-2 text-sm text-[#34A3DA] underline underline-offset-4"
              >
                Renew Next Plan
              </button>
            </p>
          </Trans>
        )}
      </section>
      {PricingTableMod}
      {PaymentMethodModal}
    </div>
  );
}

const paymentMethodText: Record<PaymentMethod, string> = {
  CRYPTO: 'Crypto',
  FIAT: 'Fiat',
  TOKEN: 'Wisdomise Token (WSDM)',
  MANUAL: 'Manual',
};
