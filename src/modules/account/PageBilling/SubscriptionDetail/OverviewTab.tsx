import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import {
  useAccountQuery,
  useInvoicesQuery,
  useStripePaymentMethodsQuery,
  useSubscription,
  useUserFirstPaymentMethod,
} from 'api';
import useModal from 'shared/useModal';
import Card from 'modules/shared/Card';
import PricingTable from '../PricingTable';
import mailIconSrc from '../images/mail.svg';

export default function OverviewTab() {
  const { t } = useTranslation('billing');
  const { data } = useAccountQuery();
  const invoices = useInvoicesQuery();
  const firstPaymentMethod = useUserFirstPaymentMethod();
  const stripePaymentMethod = useStripePaymentMethodsQuery();
  const { currentPeriodEnd, plan, refetch } = useSubscription();
  const [PricingTableMod, openPricingTable] = useModal(PricingTable, {
    width: 1200,
  });

  const handleChangePlan = async () => {
    if (await openPricingTable({ isUpdate: true })) {
      void refetch();
    }
  };

  if (
    firstPaymentMethod === 'CRYPTO' &&
    invoices.data?.results.at(-1)?.status === 'open'
  ) {
    return (
      <Card className="flex flex-col items-center justify-center !py-20">
        <img src={mailIconSrc} />
        <p className="mt-12 text-xl font-medium text-white">
          {t('subscription-details.overview.is-on-the-way.title')}
        </p>
        <p className="mt-8 max-w-[450px] text-center text-base font-medium text-white/60">
          {t('subscription-details.overview.is-on-the-way.description')}
        </p>
      </Card>
    );
  }

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

          {firstPaymentMethod !== 'CRYPTO' &&
            firstPaymentMethod !== 'TOKEN' && (
              <button onClick={handleChangePlan} className="ml-2 text-blue-600">
                {t('subscription-details.overview.btn-change-plan')}
              </button>
            )}
        </p>

        <p className="text-base text-white/70">
          <Trans i18nKey="subscription-details.overview.periodEnd" ns="billing">
            Your plan will
            {{
              action:
                firstPaymentMethod === 'CRYPTO' ||
                firstPaymentMethod === 'TOKEN'
                  ? 'expire'
                  : 'renew',
            }}
            on
            <strong className="text-white">
              {{ date: dayjs(currentPeriodEnd ?? 0).format('MMMM D, YYYY') }}
            </strong>
            .
          </Trans>{' '}
          {firstPaymentMethod === 'CRYPTO' && (
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
          {firstPaymentMethod === 'TOKEN' && (
            <span>
              {t('subscription-details.overview.automatically-renew')}
            </span>
          )}
          {firstPaymentMethod !== 'CRYPTO' &&
            firstPaymentMethod !== 'TOKEN' && (
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
        </p>
      </section>

      <section>
        <h2 className="my-4 text-base font-semibold text-white">
          {t('subscription-details.overview.billing-actions')}
        </h2>
        <div className="text-base text-white/70">
          {stripePaymentMethod.data?.data[0]?.card && (
            <p>
              <Trans i18nKey="subscription-details.overview.card" ns="billing">
                Future charges will be applied to the card
                <strong className="text-white">
                  ****{{ last4: stripePaymentMethod.data.data[0].card.last4 }}
                </strong>
                .
              </Trans>

              <Link
                className="ml-2 text-blue-600"
                to="/account/billing/change-payment-method"
              >
                {t('change-payment.change-payment-method')}
              </Link>
            </p>
          )}

          <p>
            <Trans
              i18nKey="subscription-details.overview.billing-email"
              ns="billing"
            >
              Billing emails are sent to
              <strong className="text-white">
                {{ email: data?.email ?? '' }}
              </strong>
              .
            </Trans>
          </p>
        </div>
      </section>

      {PricingTableMod}
    </div>
  );
}
