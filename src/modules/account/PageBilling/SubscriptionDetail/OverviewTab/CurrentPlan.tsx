import dayjs from 'dayjs';
import { Trans, useTranslation } from 'react-i18next';
import { useAccountQuery, useSubscription } from 'services/rest';
import type { PaymentMethod } from 'services/rest/types/subscription';
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
            i18nKey="subscription-details.overview.current-plan.your-subs"
            ns="billing"
          >
            Your subscription plan is
            <InfoBadge
              value1="Premium Access"
              value2={plan?.periodicity.toLowerCase()}
            />
          </Trans>
        </div>

        <div>
          {status !== 'trialing' && (
            <div>
              {isAutoRenewEnabled
                ? t('subscription-details.overview.current-plan.renew')
                : t('subscription-details.overview.current-plan.expire')}
              <InfoBadge
                value1={dayjs(currentPeriodEnd ?? 0).format('MMMM D, YYYY')}
                value2={dayjs(currentPeriodEnd ?? 0).fromNow(true)}
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

const paymentMethodText: Record<PaymentMethod, string> = {
  CRYPTO: 'Crypto',
  FIAT: 'Fiat',
  TOKEN: 'Staked WSDM',
  WSDM: 'Paid By WSDM',
  MANUAL: 'Manual',
};
