import { clsx } from 'clsx';
import { notification, Spin } from 'antd';
import { useCallback } from 'react';
import { type SubscriptionPlan } from 'api/types/subscription';
import Button from 'shared/Button';
import { useAccountQuery, useSubscription, useSubscriptionMutation } from 'api';
import product from './images/wisdomise-product.png';
import { ReactComponent as Check } from './images/check.svg';

interface Props {
  className?: string;
  plan: SubscriptionPlan;
  isUpdate?: boolean;
  onPlanUpdate: () => void;
}

export default function PricingCard({
  plan,
  className,
  isUpdate,
  onPlanUpdate,
}: Props) {
  const { data: account } = useAccountQuery();
  const { plan: userPlan } = useSubscription();
  const mutation = useSubscriptionMutation();

  const stripeLink = account
    ? plan.stripe_payment_link +
      '?prefilled_email=' +
      encodeURIComponent(account.email)
    : undefined;

  const handleSubmit = useCallback(() => {
    if (isUpdate) {
      void mutation.mutateAsync({ price_id: plan.stripe_price_id }).then(() => {
        notification.success({
          message:
            'Your subscription updated successfully. It might take a few minutes to activate',
          duration: 5000,
        });
        onPlanUpdate();
        return null;
      });
    } else {
      if (stripeLink) {
        window.location.href = stripeLink;
      }
    }
  }, [stripeLink, isUpdate]);

  return (
    <div
      className={clsx(
        'rounded-3xl p-8',
        plan.is_active && 'border border-gray-700 bg-white/5',
        className,
      )}
    >
      <div className="lg:min-h-[10rem] xl:min-h-[17rem]">
        <img className="mb-2 rounded-lg" src={product} alt="product" />
        <h2 className="mb-3 text-xl">{plan.name}</h2>
        <p className="text-sm text-white/60">{plan.description}</p>
      </div>

      <div className="mb-4 mt-6 flex gap-2">
        <span className="text-3xl font-semibold">${plan.price}</span>
        <div className="text-xs text-white/40">
          <div>per</div>
          <div>{plan.periodicity === 'MONTHLY' ? 'month' : 'year'}</div>
        </div>
      </div>

      <Button
        disabled={
          !plan.is_active ||
          !stripeLink ||
          plan.stripe_price_id === userPlan?.id
        }
        className="block !w-full !font-medium disabled:opacity-50"
        onClick={handleSubmit}
      >
        {stripeLink ? (
          plan.is_active ? (
            plan.stripe_price_id === userPlan?.id ? (
              'Current Plan'
            ) : isUpdate ? (
              'Update'
            ) : (
              'Buy Now'
            )
          ) : (
            'Available soon'
          )
        ) : (
          <Spin />
        )}
      </Button>

      <div className="mt-3 text-sm text-white/90">
        <div className="py-2">This includes:</div>
        <ul>
          {plan.features.map(feature => {
            return (
              <li className="mb-3 flex gap-3" key={feature}>
                <Check className="mt-1 h-4 w-4 shrink-0" />
                {feature}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
