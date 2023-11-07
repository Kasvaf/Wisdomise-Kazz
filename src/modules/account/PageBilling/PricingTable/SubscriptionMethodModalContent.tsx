import { useTranslation } from 'react-i18next';
import Button from 'modules/shared/Button';
import type { SubscriptionPlan } from 'api/types/subscription';
import useModal from 'modules/shared/useModal';
import { useUserFirstPaymentMethod } from 'api';
import TokenPaymentModalContent from 'modules/account/PageBilling/TokenPayment/TokenPaymentModalContent';
import { ReactComponent as CryptoPaymentIcon } from '../images/crypto-pay-icon.svg';
import { ReactComponent as SubscriptionMethodIcon } from '../images/subscription-method-icon.svg';
import { ReactComponent as SubscriptionMethodLogos } from '../images/subs-methods-logos.svg';
import { ReactComponent as SIcon } from '../images/s-icon.svg';
import { ReactComponent as Token } from '../images/token.svg';
import CryptoPaymentModalContent from './CryptoPaymentModalContent';

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
  const { t } = useTranslation('billing');
  const firstPaymentMethod = useUserFirstPaymentMethod();
  const [cryptoPaymentModal, openCryptoPaymentModal] = useModal(
    CryptoPaymentModalContent,
    { fullscreen: true, destroyOnClose: true },
  );

  const [tokenPaymentModal, openTokenPaymentModal] = useModal(
    TokenPaymentModalContent,
    { fullscreen: true, destroyOnClose: true },
  );

  const onCryptoClick = () => {
    onResolve?.();
    void openCryptoPaymentModal({ plan });
  };

  const onFiatClick = async () => {
    await propOnFiatClick();
    onResolve?.();
  };

  const onTokenClick = async () => {
    onResolve?.();
    void openTokenPaymentModal({ plan });
  };

  return (
    <div className="flex flex-col items-center">
      <SubscriptionMethodIcon />
      <p className="mt-6 text-xl font-medium">
        {t('subscription-modal.title')}
      </p>
      <p className="mt-6 text-sm font-medium text-white/60">
        {t('subscription-modal.subtitle')}
      </p>
      <SubscriptionMethodLogos className="mb-12 mt-8" />

      <div className="grid grid-cols-2 items-stretch gap-6 mobile:w-full mobile:flex-col">
        <Button
          className="col-span-1"
          onClick={onFiatClick}
          disabled={firstPaymentMethod && firstPaymentMethod !== 'FIAT'}
        >
          <div className="flex items-center gap-2">
            <SIcon />
            {t('subscription-modal.btn-fiat')}
          </div>
        </Button>
        <Button
          className="col-span-1"
          onClick={onCryptoClick}
          disabled={firstPaymentMethod && firstPaymentMethod !== 'CRYPTO'}
        >
          <div className="flex items-center gap-2">
            <CryptoPaymentIcon />
            {t('subscription-modal.btn-crypto')}
          </div>
        </Button>
        {plan.periodicity === 'YEARLY' && (
          <Button
            onClick={onTokenClick}
            className="col-span-2"
            // disabled={firstPaymentMethod && firstPaymentMethod !== 'CRYPTO'}
          >
            <div className="flex items-center gap-2">
              <Token />
              {t('token-modal.token-name')}
            </div>
          </Button>
        )}
      </div>
      {cryptoPaymentModal}
      {tokenPaymentModal}
    </div>
  );
}
