import { useTranslation } from 'react-i18next';
import { notification } from 'antd';
import { clsx } from 'clsx';
import { useSearchParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import type { SubscriptionPlan } from 'api/types/subscription';
import Button from 'shared/Button';
import useModal from 'shared/useModal';
import { useHasFlag } from 'api';
import { gtmClass } from 'utils/gtmClass';
import { DebugPin } from 'shared/DebugPin';
import { ReactComponent as CryptoPaymentIcon } from '../images/crypto-pay-icon.svg';
import { ReactComponent as SubscriptionMethodIcon } from '../images/subscription-method-icon.svg';
import { ReactComponent as SIcon } from '../images/s-icon.svg';
import { ReactComponent as Token } from '../images/token.svg';
import TokenPaymentModalContent from '../paymentMethods/Token';

interface Props {
  plan: SubscriptionPlan;
  onResolve?: VoidFunction;
  onFiatClick: VoidFunction;
}

export default function SubscriptionMethodModal({
  plan,
  onFiatClick: propOnFiatClick,
  onResolve,
}: Props) {
  const { t } = useTranslation('billing');
  const hasFlag = useHasFlag();

  const [tokenPaymentModal, openTokenPaymentModal] = useModal(
    TokenPaymentModalContent,
    { fullscreen: true, destroyOnClose: true },
  );

  const onCryptoClick = useCallback(() => {
    onResolve?.();
    if (plan.crypto_payment_link) {
      window.location.href = plan.crypto_payment_link;
    } else {
      notification.error({
        message: t('pricing-card.notification-call-support'),
      });
    }
  }, [onResolve, plan.crypto_payment_link, t]);

  const onFiatClick = useCallback(async () => {
    propOnFiatClick();
    onResolve?.();
  }, [onResolve, propOnFiatClick]);

  const onLockClick = useCallback(async () => {
    onResolve?.();
    void openTokenPaymentModal({ plan });
  }, [onResolve, openTokenPaymentModal, plan]);

  const onWSDMClick = useCallback(() => {
    if (plan.wsdm_payment_link) {
      window.location.href = plan.wsdm_payment_link;
    } else {
      notification.error({
        message: t('pricing-card.notification-call-support'),
      });
    }
  }, [plan.wsdm_payment_link, t]);

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.has('paymentMethod')) {
      const paymentMethod = searchParams.get('paymentMethod');
      searchParams.delete('paymentMethod');
      setSearchParams(searchParams, {
        replace: true,
      });
      switch (paymentMethod) {
        case 'crypto': {
          onCryptoClick();
          break;
        }
        case 'wsdm': {
          onWSDMClick();
          break;
        }
        case 'lock': {
          void onLockClick();
          break;
        }
        default: {
          void onFiatClick();
        }
      }
    }
  }, [
    onCryptoClick,
    onFiatClick,
    onLockClick,
    onWSDMClick,
    plan.level,
    plan.periodicity,
    searchParams,
    setSearchParams,
  ]);

  return (
    <div className="flex flex-col items-center">
      <SubscriptionMethodIcon />
      <p className="mt-6 text-xl font-medium">
        {t('subscription-modal.title')}
      </p>
      <p className="mt-6 text-sm font-medium text-white/60">
        {t('subscription-modal.subtitle', {
          name: plan.name,
          periodicity: plan.periodicity.toLowerCase(),
        })}
      </p>

      <div className="mt-8 grid grid-cols-2 items-stretch gap-6 mobile:w-full mobile:flex-col">
        {hasFlag('/account/billing?payment_method=fiat') && (
          <Button
            className={clsx('col-span-1', gtmClass('fiat-payment'))}
            onClick={onFiatClick}
          >
            <DebugPin
              title="/account/billing?payment_method=fiat"
              color="orange"
            />
            <div className="flex items-center gap-2">
              <SIcon />
              {t('subscription-modal.btn-fiat')}
            </div>
          </Button>
        )}

        {hasFlag('/account/billing?payment_method=crypto') && (
          <Button
            className={clsx('col-span-1', gtmClass('crypto-payment'))}
            onClick={onCryptoClick}
          >
            <DebugPin
              title="/account/billing?payment_method=crypto"
              color="orange"
            />
            <div className="flex items-center gap-2">
              <CryptoPaymentIcon />
              {t('subscription-modal.btn-crypto')}
            </div>
          </Button>
        )}

        {hasFlag('/account/billing?payment_method=wsdm') &&
          plan.periodicity === 'YEARLY' && (
            <Button
              className={clsx('relative col-span-1', gtmClass('wsdm-payment'))}
              onClick={onWSDMClick}
            >
              <DebugPin
                title="/account/billing?payment_method=wsdm"
                color="orange"
              />
              <div className="flex items-center gap-2">
                <Token />
                {t('subscription-modal.btn-wsdm')}
                <div className="absolute -end-2 -top-3 rounded-lg bg-gradient-to-bl from-[#615298] from-15% to-[#42427B] to-75% px-2 py-1 text-sm text-white">
                  {'50% Off'}
                </div>
              </div>
            </Button>
          )}

        <Button
          onClick={onLockClick}
          className={clsx('col-span-1', gtmClass('lock-wsdm'))}
        >
          <DebugPin
            title="/account/billing?payment_method=lock"
            color="orange"
          />
          <div className="flex items-center gap-2">
            <Token />
            {t('subscription-modal.btn-lock')}
          </div>
        </Button>
      </div>
      {tokenPaymentModal}
    </div>
  );
}
