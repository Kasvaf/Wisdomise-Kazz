import { Trans, useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { notification } from 'antd';
import { useAccountQuery, useSubscription, useSubscriptionMutation } from 'api';
import useModal from 'shared/useModal';
import PricingTable from '../../PricingTable';

export default function PlanDetails() {
  const { data } = useAccountQuery();
  const { t } = useTranslation('billing');
  const subscriptionMutation = useSubscriptionMutation();
  const { currentPeriodEnd, plan, refetch } = useSubscription();
  const [PricingTableMod, openPricingTable] = useModal(PricingTable, {
    width: 1200,
  });

  const handleChangePlan = async () => {
    if (await openPricingTable({ isUpdate: true })) {
      void refetch();
    }
  };

  const onCancelPlan = async () => {
    try {
      await subscriptionMutation.mutateAsync({ subscription_plan_key: null });
      notification.success({ message: 'Plan canceled successfully' });
    } catch {}
  };

  const onRenewPlan = async () => {
    const currentPlanKey = data?.subscription_item?.subscription_plan.key;
    try {
      if (currentPlanKey) {
        await subscriptionMutation.mutateAsync({
          subscription_plan_key: currentPlanKey,
        });
        notification.success({ message: 'Plan renewed successfully' });
      }
    } catch {}
  };

  const subItem = data?.subscription_item;
  const paymentMethod =
    subItem?.next_subs_item?.payment_method || subItem?.payment_method;

  return (
    <div>
      <section>
        <h2 className="mb-4 text-base font-semibold text-white">
          {t('subscription-details.overview.plan-details')}
        </h2>
        <p className="text-base leading-relaxed text-white/70">
          <Trans
            i18nKey="subscription-details.overview.current-plan"
            ns="billing"
          >
            Your plan is
            <strong className="text-white">{{ plan: plan?.name ?? '' }}</strong>
            .
          </Trans>
          <button onClick={handleChangePlan} className="ml-2 text-blue-600">
            {t('subscription-details.overview.btn-change-plan')}
          </button>

          {data?.subscription_item?.next_subs_item && (
            <button onClick={onCancelPlan} className="ml-2 text-red-400">
              Cancel Plan
            </button>
          )}
        </p>

        <p className="text-base text-white/70">
          <Trans i18nKey="subscription-details.overview.periodEnd" ns="billing">
            Your plan will
            {{
              action: paymentMethod === 'FIAT' ? 'renew' : 'expire',
            }}
            on
            <strong className="text-white">
              {{ date: dayjs(currentPeriodEnd ?? 0).format('MMMM D, YYYY') }}
            </strong>
            .
          </Trans>{' '}
          {paymentMethod === 'CRYPTO' && (
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
          {paymentMethod === 'TOKEN' && (
            <span>
              {t('subscription-details.overview.automatically-renew')}
            </span>
          )}
          {paymentMethod === 'FIAT' && (
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
            <>
              <br />
              <span>
                You have canceled you plan.{' '}
                <button onClick={onRenewPlan} className="ml-2 text-blue-600">
                  Renew Plan
                </button>
              </span>
            </>
          )}
        </p>
      </section>
      {PricingTableMod}
    </div>
  );
}
