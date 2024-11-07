import { clsx } from 'clsx';
import { notification } from 'antd';
import { Trans, useTranslation } from 'react-i18next';
import { type SubscriptionPlan } from 'api/types/subscription';
import { useAccountQuery, useSubscription, useSubscriptionMutation } from 'api';
import useModal from 'shared/useModal';
import TokenPaymentModalContent from 'modules/account/PageBilling/paymentMethods/Token';
import { useLockingRequirementQuery } from 'api/defi';
import { gtmClass } from 'utils/gtmClass';
import { ReactComponent as Check } from '../images/check.svg';
import SubscriptionMethodModalContent from './SubscriptionMethodModalContent';
import PlanLogo from './PlanLogo';

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
  const { isActive, plan: userPlan, type } = useSubscription();
  const [model, openModal] = useModal(SubscriptionMethodModalContent);
  const [tokenPaymentModal, openTokenPaymentModal] = useModal(
    TokenPaymentModalContent,
    { fullscreen: true, destroyOnClose: true },
  );
  const { data: lockingRequirement } = useLockingRequirementQuery(plan.price);

  const hasUserThisPlan = isActive && !isRenew && plan.key === userPlan?.key;
  const hasUserThisPlanAsNextPlan =
    isActive &&
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
    if (type === 'pro') {
      await subsMutation.mutateAsync({ subscription_plan_key: plan.key });
      notification.success({
        duration: 5000,
        message: t('pricing-card.notification-upgrade-success'),
      });
      onPlanUpdate();
    } else {
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
    }
  };

  return (
    <div className="group flex min-w-[330px] max-w-[380px] shrink grow basis-0 flex-col">
      <div
        className={clsx(
          'relative flex grow flex-col gap-6 p-6',
          'rounded-2xl border border-white/10 bg-[#28323E33]',
          className,
        )}
      >
        {/* Title */}
        <section className="flex min-h-28 flex-row items-center gap-3">
          <PlanLogo
            name={plan.name}
            className="col-span-1 row-span-2 size-14 shrink-0"
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
            <p className="text-xs leading-normal text-white/70">
              {plan.description}
            </p>
          </div>
        </section>

        {/* Price Info */}
        <div className="flex items-end gap-px text-2xl">
          <span className="text-white/50">$</span>
          <span className="font-semibold">{plan.price}</span>
          <span>/</span>
          <div className="text-white/70">
            {plan.price === 0
              ? t('pricing-card.forever')
              : plan.periodicity === 'MONTHLY'
              ? t('pricing-card.monthly')
              : t('pricing-card.annually')}
          </div>
        </div>

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
              'disabled:cursor-default disabled:bg-v1-content-primary disabled:text-v1-content-primary-inverse',
              'enabled:cursor-pointer enabled:bg-pro-gradient enabled:text-v1-content-primary-inverse',
              'transition-all enabled:hover:brightness-110 enabled:active:brightness-95',
              'flex h-12 items-center justify-center',
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
        <div className="flex items-center justify-center gap-2">
          <div className="h-px grow bg-v1-border-disabled" />
          <span className="size-1 shrink-0 rounded-full bg-v1-content-primary" />
          <div className="shrink-0 text-xs text-white/50">
            {t('pricing-card.features')}
          </div>
          <span className="size-1 shrink-0 rounded-full bg-v1-content-primary" />
          <div className="h-px grow bg-v1-border-disabled" />
        </div>
        <ul className="grow space-y-4 text-xs">
          {plan.features.map(feature => (
            <li key={feature} className="flex items-center gap-2 font-normal">
              <Check className="size-5 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {plan.price !== 0 && (
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
                i18nKey={
                  plan.periodicity === 'YEARLY'
                    ? 'pricing-card.pay-by-locking'
                    : 'pricing-card.pay-by-locking-in-yearly-only'
                }
                values={{
                  token:
                    lockingRequirement?.requirement_locking_amount?.toLocaleString() ??
                    '0',
                }}
              />
            </p>
          </div>
        )}

        {model}
        {tokenPaymentModal}
      </div>
    </div>
  );
}
