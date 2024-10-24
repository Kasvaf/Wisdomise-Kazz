import { clsx } from 'clsx';
import { notification } from 'antd';
import { Trans, useTranslation } from 'react-i18next';
import { bxCheckCircle } from 'boxicons-quasar';
import { type SubscriptionPlan } from 'api/types/subscription';
import { useAccountQuery, useSubscription, useSubscriptionMutation } from 'api';
import useModal from 'shared/useModal';
import Icon from 'shared/Icon';
import TokenPaymentModalContent from 'modules/account/PageBilling/paymentMethods/Token';
import { useLockingRequirementQuery } from 'api/defi';
import Button from 'shared/Button';
import { ReactComponent as Check } from '../images/check.svg';
import starts from '../images/stars.svg';
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
  const { isActive, plan: userPlan, isTrialPlan } = useSubscription();
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
    if (isActive && !isTrialPlan) {
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

  const currentPlanRender = (
    <>
      <Icon name={bxCheckCircle} size={20} />
      {t('pricing-card.btn-action.current-plan')}
    </>
  );

  return (
    <div className="group flex min-w-[330px] max-w-[350px] shrink grow basis-0 flex-col">
      <p
        className={clsx(
          'flex justify-center gap-1 bg-gradient-to-r from-[#FF00C7] to-[#00A3FF] to-100% bg-clip-text text-transparent',
          'mb-1 text-base font-medium',
          (plan.level !== 2 || plan.periodicity !== 'YEARLY') && 'invisible',
        )}
      >
        <img src={starts} />
        {t('pricing-card.recommended')}
      </p>
      <div
        className={clsx(
          'relative flex grow flex-col p-6',
          'rounded-2xl border border-[#9747FF] bg-[linear-gradient(168deg,#9747FF1A_0%,#9747FF0A_108%)]',
          className,
        )}
      >
        <section>
          <div className="mb-2 flex items-center gap-3">
            <PlanLogo name={plan.name} />
            <h2 className="text-gradient-to-black70 text-2xl font-semibold mobile:text-xl">
              {plan.name}
            </h2>
          </div>
          <p className="min-h-[60px] text-xs text-white/70">
            {plan.description}
          </p>
        </section>

        <div className="flex items-end gap-1">
          <p className="text-3xl font-semibold mobile:text-2xl">
            <span className="-mr-1 text-sm">$</span> {plan.price}
          </p>
          <div className="text-white/70">
            {plan.price === 0
              ? t('pricing-card.forever')
              : plan.periodicity === 'MONTHLY'
              ? t('pricing-card.monthly')
              : t('pricing-card.annually')}
          </div>
        </div>

        <div className="mt-6 flex justify-center rounded-lg bg-[#05010966] py-4 text-xs text-white/70">
          {plan.price === 0 ? (
            <p className="capitalize">{t('pricing-card.free-subtitle')}</p>
          ) : (
            <>
              {plan.periodicity === 'YEARLY' ? (
                <p className="text-xs text-white/70">
                  <Trans ns="billing" i18nKey="pricing-card.pay-by-locking">
                    Pay By Locking
                    <span className="mx-1 text-base font-semibold text-white">
                      {{
                        token:
                          lockingRequirement?.requirement_locking_amount?.toLocaleString() ??
                          0,
                      }}
                      <span className="ml-1 bg-gradient-to-r from-[#FF00C7] to-[#00A3FF] to-100% bg-clip-text text-transparent">
                        WSDM
                      </span>
                    </span>
                    Token
                  </Trans>
                </p>
              ) : (
                <p>
                  <Trans
                    ns="billing"
                    i18nKey="pricing-card.pay-by-locking-in-yearly-only"
                  >
                    Pay By Locking
                    <span className="mx-1 bg-gradient-to-r from-[#FF00C7] to-[#00A3FF] to-100% bg-clip-text text-base font-semibold text-transparent">
                      WSDM
                    </span>
                    Token: Just In Annually
                  </Trans>
                </p>
              )}
            </>
          )}
        </div>

        {plan.price !== 0 && (
          <div className="mt-6 flex items-center justify-center rounded-lg bg-[#05010966] py-4 text-xs text-white/70">
            <Trans ns="billing" i18nKey="pricing-card.pay-by-wsdm">
              Pay In
              <span className="mx-1 bg-gradient-to-r from-[#FF00C7] to-[#00A3FF] to-100% bg-clip-text text-base font-semibold text-transparent">
                WSDM
              </span>
              With{' '}
              <span className="mx-1 text-base font-semibold text-[#00A3FF]">
                50% Off
              </span>
            </Trans>
          </div>
        )}

        <div className="mb-3 mt-6 text-xs mobile:mt-3 mobile:text-xxs">
          <div className="py-2 text-white/70">
            {t('pricing-card.this-includes')}
          </div>
          <ul>
            {plan.features.map(feature => (
              <li
                key={feature}
                className="mb-3 flex items-start gap-3 font-medium"
              >
                <Check className="h-4 w-4 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={clsx(
            'flex grow items-end',
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
            variant="primary-purple"
            className={clsx(
              'w-full !text-base',
              (hasUserThisPlan || hasUserThisPlanAsNextPlan) &&
                '!cursor-default !text-white',
            )}
            data-id={`buy-now_${plan.periodicity.toLowerCase()}_${plan.name.toLowerCase()}`}
          >
            <div className="flex items-center justify-center gap-2">
              {plan.is_active
                ? hasUserThisPlan || hasUserThisPlanAsNextPlan
                  ? hasUserThisPlan
                    ? currentPlanRender
                    : t('pricing-card.btn-action.next-plan')
                  : isUpdate
                  ? t('pricing-card.btn-action.choose')
                  : isRenew
                  ? t('pricing-card.btn-action.choose')
                  : isTokenUtility
                  ? t('pricing-card.btn-action.activate-now')
                  : t('pricing-card.btn-action.buy-now')
                : currentPlanRender}
            </div>
          </Button>
        </div>
        {model}
        {tokenPaymentModal}
      </div>
    </div>
  );
}
