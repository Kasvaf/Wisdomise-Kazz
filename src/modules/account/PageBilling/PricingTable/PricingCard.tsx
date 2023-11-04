import { clsx } from 'clsx';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { type SubscriptionPlan } from 'api/types/subscription';
import Button from 'shared/Button';
import {
  useAccountQuery,
  useSubscription,
  useSubscriptionMutation,
  useUserFirstPaymentMethod,
} from 'api';
import useModal from 'modules/shared/useModal';
import product from '../images/wisdomise-product.png';
import { ReactComponent as Check } from '../images/check.svg';
import Periodicity from '../Periodicity';
import SubscriptionMethodModalContent from './SubscriptionMethodModalContent';

interface Props {
  className?: string;
  plan: SubscriptionPlan;
  isUpdate?: boolean;
  onPlanUpdate: () => void;
}

export default function PricingCard({
  plan,
  isUpdate,
  className,
  onPlanUpdate,
}: Props) {
  const { t } = useTranslation('billing');
  const mutation = useSubscriptionMutation();
  const { data: account } = useAccountQuery();
  const { plan: userPlan } = useSubscription();
  const firstPaymentMethod = useUserFirstPaymentMethod();
  const [subscriptionMethodModal, openSubscriptionMethodModal] = useModal(
    SubscriptionMethodModalContent,
    { centered: true },
  );

  const hasUserThisPlan = plan.stripe_price_id === userPlan?.id;
  const isPlanCheaperThanUserPlan = plan.price * 100 < (userPlan?.amount ?? 0);

  const handleFiatPayment = async () => {
    if (isUpdate) {
      if (plan.stripe_price_id === userPlan?.id) {
        return;
      }
      await mutation
        .mutateAsync({ price_id: plan.stripe_price_id })
        .then(() => {
          notification.success({
            message: t('pricing-card.notification-upgrade-success'),
            duration: 5000,
          });
          onPlanUpdate();
          return null;
        });
    } else {
      window.location.href =
        plan.stripe_payment_link +
        '?prefilled_email=' +
        encodeURIComponent(account?.email || '');
    }
  };

  const onClick = () => {
    // JUST in upgrade scenario for fiat we need this condition to not show modal,
    // Crypto up to now does not have upgrade.
    if (firstPaymentMethod === 'FIAT') {
      void handleFiatPayment();
    } else {
      void openSubscriptionMethodModal({
        onFiatClick: handleFiatPayment,
        plan,
      });
    }
  };

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
          <Periodicity periodicity={plan.periodicity} />
        </div>
      </div>
      <Button
        onClick={onClick}
        disabled={
          !plan.is_active || isPlanCheaperThanUserPlan || hasUserThisPlan
        }
        className={clsx(
          'block !w-full !font-medium',
          // active plan is disabled, but has different styling
          hasUserThisPlan && '!cursor-default !text-white',
        )}
      >
        {plan.is_active
          ? hasUserThisPlan
            ? t('pricing-card.btn-action.current-plan')
            : isUpdate
            ? t('pricing-card.btn-action.upgrade')
            : t('pricing-card.btn-action.buy-now')
          : t('pricing-card.btn-action.available-soon')}
      </Button>
      <div className="mt-3 text-sm text-white/90">
        <div className="py-2">{t('pricing-card.this-includes')}</div>
        <ul>
          {plan.features.map(feature => (
            <li className="mb-3 flex gap-3" key={feature}>
              <Check className="mt-1 h-4 w-4 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      {subscriptionMethodModal}
    </div>
  );
}
