import { Link } from 'react-router-dom';
import {
  useAccountQuery,
  useInvoicesQuery,
  useStripePaymentMethodsQuery,
  useSubscription,
  useUserFirstPaymentMethod,
} from 'api';
import useModal from 'shared/useModal';
import PricingTable from '../pricingTable';
import mailIconSrc from '../images/mail.svg';

export default function OverviewTab() {
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
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white/5 py-20">
        <img src={mailIconSrc} />
        <p className="mt-12 text-xl font-medium text-white">
          Your subscription is on the way
        </p>
        <p className="mt-8 max-w-[450px] text-center text-base font-medium text-white/60">
          You paid for your subscription via crypto payment, it takes 24-48
          hours to verify your transaction. We will email you when your
          subscription is activated
        </p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="mb-4 text-base font-semibold text-white">Plan Details</h1>
      <p className="text-base leading-relaxed text-white/70">
        Your plan is <strong className="text-white">{plan?.name}</strong>.{' '}
        {firstPaymentMethod !== 'CRYPTO' && (
          <button onClick={handleChangePlan} className="text-blue-600">
            Change plan
          </button>
        )}
      </p>
      <p className="text-base text-white/70">
        Your plan will {firstPaymentMethod === 'CRYPTO' ? 'expire' : 'renew'} on{' '}
        <strong className="text-white">
          {new Date(currentPeriodEnd ?? 0).toLocaleString('default', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </strong>
        .
        {firstPaymentMethod !== 'CRYPTO' && (
          <>
            Charging your credit card{' '}
            <strong className="text-white">${(plan?.amount ?? 0) / 100}</strong>
            .
          </>
        )}
      </p>

      <h1 className="my-4 text-base font-semibold text-white">
        Billing actions
      </h1>
      <div className="text-base text-white/70">
        {stripePaymentMethod.data?.data[0]?.card && (
          <p>
            Future charges will be applied to the card{' '}
            <strong className="text-white">
              ****{stripePaymentMethod.data.data[0].card.last4}
            </strong>
            .{' '}
            <Link
              className="text-blue-600"
              to="/account/billing/change-payment-method"
            >
              Change payment method
            </Link>
          </p>
        )}
        <p>
          Billing emails are sent to{' '}
          <strong className="text-white">{data?.email}</strong>.
        </p>
      </div>

      {PricingTableMod}
    </div>
  );
}
