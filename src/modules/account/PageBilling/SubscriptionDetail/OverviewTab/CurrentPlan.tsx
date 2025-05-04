import { Trans, useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useAccountQuery, useSubscription } from 'api';
import { type PaymentMethod } from 'api/types/subscription';
import InfoBadge from './InfoBadge';
import PendingInvoice from './PendingInvoice';

export default function CurrentPlan() {
  const { data } = useAccountQuery();
  const { t } = useTranslation('billing');
  const { currentPeriodEnd, plan, status } = useSubscription();

  const subItem = data?.subscription_item;
  const isAutoRenewEnabled = !subItem?.cancel_at_period_end;
  const paymentMethod = subItem?.payment_method;

  return (
    <div>
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center">
          <Trans
            ns="billing"
            i18nKey="subscription-details.overview.current-plan.your-subs"
          >
            Your subscription plan is
            <InfoBadge
              value1={plan?.name}
              value2={plan?.periodicity.toLowerCase()}
            />
          </Trans>
          {/* {!(plan?.level === 2 && plan?.periodicity === 'YEARLY') && ( */}
          {/*   <button */}
          {/*     onClick={() => openPricingTable({ isUpdate: true })} */}
          {/*     className="text-sm text-[#34A3DA] underline decoration-current underline-offset-4 disabled:text-white/40" */}
          {/*     disabled={paymentMethod === 'TOKEN'} */}
          {/*   > */}
          {/*     {t('subscription-details.overview.btn-change-plan')} */}
          {/*   </button> */}
          {/* )} */}
        </div>

        <div>
          {status !== 'trialing' && (
            <div>
              {isAutoRenewEnabled
                ? t('subscription-details.overview.current-plan.renew')
                : t('subscription-details.overview.current-plan.expire')}
              <InfoBadge
                value2={dayjs(currentPeriodEnd ?? 0).fromNow(true)}
                value1={dayjs(currentPeriodEnd ?? 0).format('MMMM D, YYYY')}
              />
            </div>
          )}
        </div>
        <div>
          Your payment method is
          {paymentMethod && (
            <InfoBadge value1={paymentMethodText[paymentMethod]} />
          )}
        </div>
        <PendingInvoice />
      </section>
    </div>
  );
}

export const paymentMethodText: Record<PaymentMethod, string> = {
  CRYPTO: 'Crypto',
  FIAT: 'Fiat',
  TOKEN: 'Staked WSDM',
  WSDM: 'Paid By WSDM',
  MANUAL: 'Manual',
};
