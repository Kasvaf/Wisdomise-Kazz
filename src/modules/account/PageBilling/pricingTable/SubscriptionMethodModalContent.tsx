import { useCallback } from 'react';
import Button from 'modules/shared/Button';
import type { SubscriptionPlan } from 'api/types/subscription';
import useModal from 'modules/shared/useModal';
import { useUserFirstPaymentMethod } from 'api';
import { ReactComponent as CryptoPaymentIcon } from '../images/crypto-pay-icon.svg';
import { ReactComponent as SubscriptionMethodIcon } from '../images/subscription-method-icon.svg';
import { ReactComponent as SubscriptionMethodLogos } from '../images/subs-methods-logos.svg';
import { ReactComponent as SIcon } from '../images/s-icon.svg';
import CryptoPaymentModalContent from '../cryptoPayment/CryptoPaymentModalContent';

interface Props {
  plan: SubscriptionPlan;
  onResolve?: () => void;
  onFiatClick: () => Promise<void>;
}

export default function SubscriptionMethodModal({
  plan,
  onFiatClick: propOnFiatClick,
  onResolve,
}: Props) {
  const firstPaymentMethod = useUserFirstPaymentMethod();
  const [cryptoPaymentModal, openCryptoPaymentModal] = useModal(
    CryptoPaymentModalContent,
    { fullscreen: true, destroyOnClose: true },
  );

  const onCryptoClick = useCallback(() => {
    onResolve?.();
    void openCryptoPaymentModal({ plan });
  }, [onResolve, openCryptoPaymentModal, plan]);

  const onFiatClick = useCallback(async () => {
    await propOnFiatClick();
    onResolve?.();
  }, [onResolve, propOnFiatClick]);

  return (
    <div className="flex flex-col items-center">
      <SubscriptionMethodIcon />
      <p className="mt-6 text-xl font-medium">Subscription Method</p>
      <p className="mt-6 text-sm font-medium text-white/60">
        Please select the payment method that suits your preferences.
      </p>
      <SubscriptionMethodLogos className="mb-12 mt-8" />

      <div className="flex flex-wrap items-stretch gap-6 mobile:w-full mobile:flex-col">
        <Button
          onClick={onFiatClick}
          disabled={firstPaymentMethod && firstPaymentMethod !== 'FIAT'}
        >
          <div className="flex items-center gap-2">
            <SIcon />
            Fiat Payment
          </div>
        </Button>
        <Button
          onClick={onCryptoClick}
          disabled={firstPaymentMethod && firstPaymentMethod !== 'CRYPTO'}
        >
          <div className="flex items-center gap-2">
            <CryptoPaymentIcon />
            Crypto Payment
          </div>
        </Button>
      </div>
      {cryptoPaymentModal}
    </div>
  );
}
