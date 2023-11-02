import { useCallback } from 'react';
import Button from 'modules/shared/Button';
import type { SubscriptionPlan } from 'api/types/subscription';
import useModal from 'modules/shared/useModal';
import TokenPaymentModalContent from 'modules/account/PageBilling/tokenPayment/TokenPaymentModalContent';
import { ReactComponent as CryptoPaymentIcon } from '../images/crypto-pay-icon.svg';
import { ReactComponent as SubscriptionMethodIcon } from '../images/subscription-method-icon.svg';
import { ReactComponent as SubscriptionMethodLogos } from '../images/subs-methods-logos.svg';
import { ReactComponent as SIcon } from '../images/s-icon.svg';
import { ReactComponent as Token } from '../images/token.svg';
import CryptoPaymentModalContent from '../cryptoPayment/CryptoPaymentModalContent';

interface Props {
  plan: SubscriptionPlan;
  onResolve?: () => void;
  onFiatClick: () => void;
}

export default function SubscriptionMethodModal({
  plan,
  onFiatClick,
  onResolve,
}: Props) {
  const [cryptoPaymentModal, openCryptoPaymentModal] = useModal(
    CryptoPaymentModalContent,
    { fullscreen: true },
  );
  const [tokenPaymentModal, openTokenPaymentModal] = useModal(
    TokenPaymentModalContent,
    { fullscreen: true },
  );

  const onCryptoClick = useCallback(() => {
    onResolve?.();
    void openCryptoPaymentModal({ plan });
  }, [onResolve, openCryptoPaymentModal, plan]);

  const onTokenClick = useCallback(() => {
    onResolve?.();
    void openTokenPaymentModal({ plan });
  }, [onResolve, openCryptoPaymentModal, plan]);

  return (
    <div className="flex flex-col items-center">
      <SubscriptionMethodIcon />
      <p className="mt-6 text-xl font-medium">Subscription Method</p>
      <p className="mt-6 text-sm font-medium text-white/60">
        Please select the payment method that suits your preferences.
      </p>
      <SubscriptionMethodLogos className="mb-12 mt-8" />

      <div className="grid grid-cols-2 items-stretch gap-6 mobile:w-full mobile:flex-col">
        <Button onClick={onFiatClick} className="col-span-1">
          <div className="flex items-center gap-2">
            <SIcon />
            Fiat Payment
          </div>
        </Button>
        <Button onClick={onCryptoClick} className="col-span-1">
          <div className="flex items-center gap-2">
            <CryptoPaymentIcon />
            Crypto Payment
          </div>
        </Button>
        <Button onClick={onTokenClick} className="col-span-2">
          <div className="flex items-center gap-2">
            <Token />
            WSDM Token
          </div>
        </Button>
      </div>
      {cryptoPaymentModal}
      {tokenPaymentModal}
    </div>
  );
}
