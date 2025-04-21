import { Trans, useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useAccountQuery, useSubscription } from 'api';
import useModal from 'shared/useModal';
import { type PaymentMethod } from 'api/types/subscription';
import PricingTable from '../../PricingTable';
import InfoBadge from './InfoBadge';
import PendingInvoice from './PendingInvoice';

export default function CurrentPlan() {
  const { data } = useAccountQuery();
  const { t } = useTranslation('billing');
  const { currentPeriodEnd, plan, status } = useSubscription();
  const [PricingTableMod] = useModal(PricingTable, {
    width: 1200,
    className: '[&_.ant-modal-content]:p-4',
  });

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
        {paymentMethod === 'TOKEN' ? (
          <div>
            You will have access to Wise club until you have more than $1000
            staked
          </div>
        ) : (
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
        )}
        <PendingInvoice />
      </section>
      {PricingTableMod}
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
