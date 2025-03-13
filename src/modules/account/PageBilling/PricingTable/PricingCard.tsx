import { clsx } from 'clsx';
import { notification } from 'antd';
import { Trans, useTranslation } from 'react-i18next';
import { type SubscriptionPlan } from 'api/types/subscription';
import { useAccountQuery, useSubscription, useSubscriptionMutation } from 'api';
import useModal from 'shared/useModal';
import TokenPaymentModalContent from 'modules/account/PageBilling/paymentMethods/Token';
import { useLockingRequirementQuery } from 'api/defi';
import { gtmClass } from 'utils/gtmClass';
import { Button } from 'shared/v1-components/Button';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { APP_PANEL } from 'config/constants';
import cardBg from '../images/card-bg.png';
import SubscriptionMethodModalContent from './SubscriptionMethodModalContent';
import { PlanHeader } from './PlanHeader';
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
  const { plan: userPlan } = useSubscription();
  const [model, openModal] = useModal(SubscriptionMethodModalContent, {
    rootClassName: clsx(
      (isRenew || isUpdate) &&
        account.data?.subscription_item?.payment_method !== 'MANUAL' &&
        '!hidden',
    ),
  });
  const [tokenPaymentModal, openTokenPaymentModal] = useModal(
    TokenPaymentModalContent,
    { fullscreen: true, destroyOnClose: true },
  );
  const { data: lockingRequirement } = useLockingRequirementQuery(plan.price);
  const { isEmbeddedView } = useEmbedView();

  const hasUserThisPlan = plan.key === userPlan?.key;
  const hasUserThisPlanAsNextPlan = false;

  const isActionButtonDisabled =
    !plan.is_active ||
    hasUserThisPlan ||
    hasUserThisPlanAsNextPlan ||
    (isRenew &&
      account.data?.subscription_item?.payment_method === 'TOKEN' &&
      plan.periodicity === 'MONTHLY');

  const onClick = async () => {
    if (isEmbeddedView && top) {
      top.window.location.href = `${APP_PANEL}/account/billing`;
      return;
    }
    if (isUpdate || isRenew) {
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
    <div className="group flex min-w-[330px] max-w-[380px] shrink grow basis-0 flex-col mobile:w-full mobile:max-w-full">
      <div
        className={clsx(
          'relative grow p-px',
          'overflow-hidden rounded-2xl',
          plan.metadata?.most_popular === true
            ? 'bg-wsdm-gradient'
            : 'bg-v1-border-tertiary',
          className,
        )}
      >
        <div className="relative flex h-full flex-col gap-6 rounded-2xl bg-v1-surface-l3 p-6">
          {plan.metadata?.most_popular === true && (
            <>
              <img
                src={cardBg}
                className="absolute h-auto w-full object-cover opacity-60"
              />
              <div className="absolute -top-32 left-1/2 h-1/2 w-64 -translate-x-1/2 bg-wsdm-gradient opacity-50 blur-3xl" />
            </>
          )}
          {/* Title */}
          <PlanHeader
            className="relative h-auto min-h-28 shrink-0"
            plan={plan}
          />

          {/* Button */}
          <div
            className={clsx(
              'relative',
              // user has higher level plan
              plan.level === 0 && (userPlan?.level || 0) > 0 && 'invisible',
              userPlan?.level === 0 &&
                plan.periodicity === 'MONTHLY' &&
                plan.level === 0 &&
                'invisible',
            )}
          >
            <Button
              onClick={onClick}
              disabled={isActionButtonDisabled}
              variant="pro"
              block
              className={clsx(
                'w-full font-semibold disabled:bg-v1-background-disabled',
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
            </Button>
          </div>

          {/* Features */}
          <PlanFeatures features={plan.features} className="relative grow" />

          {plan.token_hold_support ? (
            <div className="relative mt-6 flex justify-center rounded-lg bg-white/5 py-3 text-xxs text-white/70">
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
        </div>

        {model}
        {tokenPaymentModal}
      </div>
    </div>
  );
}
