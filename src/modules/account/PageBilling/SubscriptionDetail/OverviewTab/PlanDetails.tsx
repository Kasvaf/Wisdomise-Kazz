import { Trans, useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { notification } from 'antd';
import { useAccountQuery, useSubscription, useSubscriptionMutation } from 'api';
import useModal from 'shared/useModal';
import { type PaymentMethod } from 'api/types/subscription';
import { unwrapErrorMessage } from 'utils/error';
import PricingTable from '../../PricingTable';

export default function PlanDetails() {
  const { data } = useAccountQuery();
  const { t } = useTranslation('billing');
  const { currentPeriodEnd, plan } = useSubscription();
  const subscriptionMutation = useSubscriptionMutation();
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

  const subItem = data?.subscription_item;
  const nextSubs = subItem?.next_subs_item;
  const paymentMethod =
    subItem?.next_subs_item?.payment_method || subItem?.payment_method;

  return (
    <div>
      <section>
        <h2 className="mb-4 text-base font-semibold text-white">
          {t('subscription-details.overview.plan-details')}
        </h2>

        <p className="text-base text-white/70">
          <Trans
            i18nKey="subscription-details.overview.current-plan"
            ns="billing"
          >
            Your current plan is
            <strong className="capitalize text-white">
              {{
                plan:
                  (plan?.name || '') +
                  ' (' +
                  (plan?.periodicity.toLowerCase() || '') +
                  ')',
              }}
            </strong>
            .
          </Trans>
          {nextSubs && (
            <button
              className="ml-1 text-blue-600"
              onClick={() => openPricingTable({ isUpdate: true })}
            >
              {t('subscription-details.overview.btn-change-plan')}
            </button>
          )}
        </p>

        <p className="text-base text-white/70">
          <Trans i18nKey="subscription-details.overview.periodEnd" ns="billing">
            Your plan will
            {{
              action: paymentMethod === 'FIAT' && nextSubs ? 'renew' : 'expire',
            }}
            on
            <strong className="text-white">
              {{ date: dayjs(currentPeriodEnd ?? 0).format('MMMM D, YYYY') }}
            </strong>
            .
          </Trans>{' '}
          {paymentMethod === 'CRYPTO' && nextSubs && (
            <span>
              <Trans
                i18nKey="subscription-details.overview.in-order-to-renew"
                ns="billing"
              >
                <strong className="text-white">
                  {{
                    date: dayjs(currentPeriodEnd ?? 0).format('MMMM D, YYYY'),
                  }}
                </strong>
                .
              </Trans>
            </span>
          )}
          {paymentMethod === 'TOKEN' && nextSubs && (
            <span>
              {t('subscription-details.overview.automatically-renew')}
            </span>
          )}
          {paymentMethod === 'FIAT' && nextSubs && (
            <Trans
              i18nKey="subscription-details.overview.charging"
              ns="billing"
            >
              Charging your credit card
              <strong className="text-white">
                ${{ amount: plan?.price ?? 0 }}
              </strong>
              .
            </Trans>
          )}
          {!data?.subscription_item?.next_subs_item && (
            <Trans
              ns="billing"
              i18nKey="subscription-details.overview.next-plan-canceled"
            >
              <br />
              <span>
                Your next plan has been canceled.
                <button
                  onClick={() => openPricingTable({ isRenew: true })}
                  className="ml-2 text-blue-600"
                >
                  Renew Next Plan
                </button>
              </span>
            </Trans>
          )}
        </p>
        {nextSubs && (
          <Trans
            ns="billing"
            i18nKey="subscription-details.overview.next-plan-info"
          >
            <p className="text-base text-white/70">
              Your next plan is{' '}
              <b className="capitalize text-white">
                {{ nextPlanName: nextSubs.subscription_plan.name }}{' '}
                {{
                  period: `(${nextSubs.subscription_plan.periodicity.toLowerCase()})`,
                }}
              </b>{' '}
              with{' '}
              <b className="text-white">
                {' '}
                {{ payMethod: paymentMethodText[nextSubs.payment_method] }}
              </b>{' '}
              payment method.
              <button onClick={onCancelPlan} className="ml-1 text-red-400">
                Cancel Next Plan
              </button>
            </p>
          </Trans>
        )}
      </section>
      {PricingTableMod}
    </div>
  );
}
const paymentMethodText: Record<PaymentMethod, string> = {
  CRYPTO: 'Crypto',
  FIAT: 'Fiat',
  TOKEN: 'Wisdomise Token (WSDM)',
  MANUAL: 'Manual',
};
