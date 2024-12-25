import { clsx } from 'clsx';
import { notification } from 'antd';
import { Trans, useTranslation } from 'react-i18next';
import { type SubscriptionPlan } from 'api/types/subscription';
import { useAccountQuery, useSubscription, useSubscriptionMutation } from 'api';
import useModal from 'shared/useModal';
import TokenPaymentModalContent from 'modules/account/PageBilling/paymentMethods/Token';
import { useLockingRequirementQuery } from 'api/defi';
import { gtmClass } from 'utils/gtmClass';
import SubscriptionMethodModalContent from './SubscriptionMethodModalContent';
import { PlanHeader } from './PlanHeader';
import { PlanPrice } from './PlanPrice';
import { PlanFeatures } from './PlanFeatures';

interface Props {
  isRenew?: boolean;
  className?: string;
  isUpdate?: boolean;
  isTokenUtility?: boolean;
  plan: SubscriptionPlan;
  onPlanUpdate: VoidFunction;
}

export default function PricingCard({
  plan,
  isRenew,
  isUpdate,
  isTokenUtility,
  className,
  onPlanUpdate,
}: Props) {
  const account = useAccountQuery();
  const { t } = useTranslation('billing');
  const subsMutation = useSubscriptionMutation();
  const { plan: userPlan, level, status } = useSubscription();
  const [model, openModal] = useModal(SubscriptionMethodModalContent);
  const [tokenPaymentModal, openTokenPaymentModal] = useModal(
    TokenPaymentModalContent,
    { fullscreen: true, destroyOnClose: true },
  );
  const { data: lockingRequirement } = useLockingRequirementQuery(plan.price);

  const hasUserThisPlan =
    status === 'active' && !isRenew && plan.key === userPlan?.key;
  const hasUserThisPlanAsNextPlan =
    status === 'active' &&
    plan.key ===
      account.data?.subscription_item?.next_subs_item?.subscription_plan.key;

  const isActionButtonDisabled =
    !plan.is_active ||
    hasUserThisPlan ||
    hasUserThisPlanAsNextPlan ||
    (isRenew &&
      account.data?.subscription_item?.payment_method === 'TOKEN' &&
      plan.periodicity === 'MONTHLY');

  const onClick = async () => {
    if (level === 0 || status === 'trialing') {
      if (isTokenUtility) {
        void openTokenPaymentModal({ plan });
      } else {
        void openModal({
          onFiatClick: () => {
            if (plan.stripe_payment_link) {
              window.location.href = plan.stripe_payment_link;
            } else {
              notification.error({
                message: t('pricing-card.notification-call-support'),
              });
            }
          },
          plan,
        });
      }
    } else {
      await subsMutation.mutateAsync({ subscription_plan_key: plan.key });
      notification.success({
        duration: 5000,
        message: t('pricing-card.notification-upgrade-success'),
      });
      onPlanUpdate();
    }
  };

  return (
    <div className="group flex min-w-[330px] max-w-[380px] shrink grow basis-0 flex-col mobile:w-full mobile:max-w-full">
      <div
        className={clsx(
          'relative flex grow flex-col gap-6 p-6',
          'rounded-2xl border border-white/10 bg-[#28323E33]',
          className,
        )}
      >
        {/* Title */}
        <PlanHeader
          className="min-h-28"
          name={plan.name}
          description={plan.description}
        />

        {/* Price Info */}
        <PlanPrice price={plan.price} periodicity={plan.periodicity} />

        {/* Button */}
        <div
          className={clsx(
            // user has higher level plan
            plan.level === 0 && (userPlan?.level || 0) > 0 && 'invisible',
            userPlan?.level === 0 &&
              plan.periodicity === 'MONTHLY' &&
              plan.level === 0 &&
              'invisible',
          )}
        >
          <button
            onClick={onClick}
            disabled={isActionButtonDisabled}
            className={clsx(
              'w-full cursor-pointer rounded-xl text-sm font-semibold',
              'flex h-12 items-center justify-center',
              'disabled:cursor-default disabled:bg-v1-content-primary disabled:text-v1-content-primary-inverse',
              'enabled:cursor-pointer enabled:bg-pro-gradient enabled:text-v1-content-primary-inverse',
              'transition-all enabled:hover:brightness-110 enabled:active:brightness-95',
              gtmClass(`buy-now ${plan.periodicity} ${plan.name}`),
            )}
          >
            {plan.is_active
              ? hasUserThisPlan || hasUserThisPlanAsNextPlan
                ? hasUserThisPlan
                  ? t('pricing-card.btn-action.current-plan')
                  : t('pricing-card.btn-action.next-plan')
                : isUpdate
                ? t('pricing-card.btn-action.choose')
                : isRenew
                ? t('pricing-card.btn-action.choose')
                : isTokenUtility
                ? t('pricing-card.btn-action.activate-now')
                : t('pricing-card.btn-action.upgrade-to', {
                    plan: plan.name,
                  })
              : t('pricing-card.btn-action.current-plan')}
          </button>
        </div>

        {/* Features */}
        <PlanFeatures features={plan.features} className="grow" />

        {plan.token_hold_support ? (
          <div className="mt-6 flex justify-center rounded-lg bg-white/5 py-3 text-xxs text-white/70">
            <p
              className={clsx(
                'text-xxs text-white/70',
                '[&_b]:bg-wsdm-gradient',
                '[&_b]:rounded [&_b]:px-2 [&_b]:py-px [&_b]:font-semibold [&_b]:text-white',
              )}
            >
              <Trans
                ns="billing"
                i18nKey="pricing-card.pay-by-locking"
                values={{
                  token:
                    lockingRequirement?.requirement_locking_amount?.toLocaleString() ??
                    '0',
                }}
              />
            </p>
          </div>
        ) : (
          <div className="hidden">
            <Trans
              ns="billing"
              i18nKey="pricing-card.pay-by-locking-in-yearly-only"
            />
          </div>
        )}

        {model}
        {tokenPaymentModal}
      </div>
    </div>
  );
}
