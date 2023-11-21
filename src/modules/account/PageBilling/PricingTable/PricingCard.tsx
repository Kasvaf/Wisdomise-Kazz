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
import { ReactComponent as Check } from '../images/check.svg';
import SubscriptionMethodModalContent from './SubscriptionMethodModalContent';
import PlanLogo from './PlanLogo';

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
        'relative flex shrink-0 grow-0 basis-64 flex-col rounded-2xl p-8',
        'bg-gradient-to-b from-white/5 to-black/0',
        className,
      )}
    >
      <div className="absolute left-0 top-[20%] h-1/2 w-[1px] bg-[radial-gradient(circle,_#ffffff80_0%,_#ffffff00_100%)]" />
      <div className="absolute right-0 top-[40%] h-3/5 w-[1px] bg-[radial-gradient(circle,_#ffffff80_0%,_#ffffff00_100%)]" />

      <section>
        <PlanLogo name={plan.name} />
        <h2 className="mb-3 mt-6 text-lg font-semibold">{plan.name}</h2>
        <p className="min-h-[100px] text-xs text-white/60">
          {plan.description}
        </p>
      </section>

      <div className="flex items-center justify-between rounded-lg bg-white/10 px-2 py-3 leading-none">
        <p className="text-xs text-white/50">$ USD</p>
        <span className="font-semibold">${plan.price}</span>
        <div className="text-xs text-white/40">
          {plan.periodicity === 'MONTHLY'
            ? t('pricing-card.monthly')
            : t('pricing-card.annually')}
        </div>
      </div>

      <div>
        <div className="my-3 flex items-center gap-4">
          <div className="h-px w-full bg-gradient-to-r from-gray-500"></div>
          <span className="text-xs">OR</span>
          <div className="h-px w-full bg-gradient-to-r from-gray-500"></div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-white/10 px-2 py-3 leading-none">
          <p className="bg-gradient-to-r from-[#00A3FF] to-[#FF00C7] to-100% bg-clip-text text-xs text-transparent">
            $ tWSDM
          </p>
          {plan.periodicity === 'YEARLY' ? (
            <span className="font-medium">
              {plan.wsdm_token_hold.toLocaleString()}{' '}
              <span className="text-xxs">{t('pricing-card.token')}</span>
            </span>
          ) : (
            <span className="text-xs">{t('pricing-card.just-yearly')}</span>
          )}

          <div
            className={clsx(
              'text-xs text-white/40',
              plan.periodicity === 'MONTHLY' && 'invisible',
            )}
          >
            {t('pricing-card.hold')}
          </div>
        </div>
      </div>

      <Button
        onClick={onClick}
        disabled={
          !plan.is_active || isPlanCheaperThanUserPlan || hasUserThisPlan
        }
        className={clsx(
          'my-8 block !w-full !font-medium',
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
      <div className="text-xs text-white/90">
        <div className="py-2 text-white/50">
          {t('pricing-card.this-includes')}
        </div>
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
