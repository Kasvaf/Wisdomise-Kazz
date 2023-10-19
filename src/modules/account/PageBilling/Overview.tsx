import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAccountQuery, usePaymentMethodsQuery, useSubscription } from 'api';
import useModal from 'shared/useModal';
import PricingTable from 'modules/account/PageBilling/PricingTable';

export default function Overview() {
  const { currentPeriodEnd, plan, planName, refetch } = useSubscription();
  const { data: paymentMethod } = usePaymentMethodsQuery();
  const { data } = useAccountQuery();
  const [PricingTableMod, openPricingTable] = useModal(PricingTable, {
    width: 1200,
  });

  const handleChangePlan = useCallback(async () => {
    if (await openPricingTable({ isUpdate: true })) {
      void refetch();
    }
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-base font-semibold text-white">Plan Details</h1>
      <ul className="text-gray-400">
        <li>
          Your plan is <strong className="text-white">{planName}</strong>.{' '}
          <button onClick={handleChangePlan} className="text-blue-600">
            Change plan
          </button>
        </li>
        <li>
          Your plan will renew on{' '}
          <strong className="text-white">
            {new Date(currentPeriodEnd ?? 0).toLocaleString('default', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </strong>
          . Charging your credit card{' '}
          <strong className="text-white">${(plan?.amount ?? 0) / 100}</strong>.
        </li>
      </ul>

      <h1 className="my-4 text-base font-semibold text-white">
        Billing actions
      </h1>
      <ul className="text-gray-400">
        {paymentMethod?.data[0]?.card && (
          <li>
            Future charges will be applied to the card{' '}
            <strong className="text-white">
              ****{paymentMethod.data[0].card.last4}
            </strong>
            .{' '}
            <Link
              className="text-blue-600"
              to="/account/billing/change-payment-method"
            >
              Change payment method
            </Link>
          </li>
        )}
        <li>
          Billing emails are sent to{' '}
          <strong className="text-white">{data?.email}</strong>.
        </li>
      </ul>

      {PricingTableMod}
    </div>
  );
}
