/* eslint-disable import/max-dependencies */
import type React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useInvestorAssetStructuresQuery,
  useCreateFPIMutation,
  useSubscription,
} from 'api';
import { type FinancialProduct } from 'api/types/financialProduct';
import { trackClick } from 'config/segment';
import Button from 'shared/Button';
import useModalExchangeAccountSelector from 'modules/account/useModalExchangeAccountSelector';
import useModalApiKey from './useModalApiKey';
import useModalDisclaimer from './useModalDisclaimer';
import useEnsureSubscription from './useEnsureSubscription';
import useModalActivationNotice from './useModalActivationNotice';

interface Props {
  inDetailPage?: boolean;
  className?: string;
  financialProduct: FinancialProduct;
}

const ButtonActivate: React.FC<Props> = ({
  className,
  financialProduct: fp,
}) => {
  const { t } = useTranslation('products');
  const createFPI = useCreateFPIMutation();
  const ias = useInvestorAssetStructuresQuery();
  const [ModalActivationNotice, showActivationNotice] =
    useModalActivationNotice();
  const hasIas = Boolean(ias.data?.[0]?.main_exchange_account);
  const market =
    (fp.config.can_use_external_account &&
      fp.config.external_account_market_type) ||
    undefined;

  const fpis = ias.data?.[0]?.financial_product_instances;
  const isOtherFPActive =
    (fpis?.length || 0) > 0 && fp?.key !== fpis?.[0]?.financial_product.key;

  const [ModalExchangeAccountSelector, showModalExchangeAccountSelector] =
    useModalExchangeAccountSelector();
  const [ModalDisclaimer, openDisclaimer] = useModalDisclaimer();
  const [ModalApiKey, showModalApiKey] = useModalApiKey();
  const [SubscribeModal, ensureSubscribed] = useEnsureSubscription();

  const onActivateClick = async () => {
    await showActivationNotice();
    trackClick('activate_strategie_button')();
    if (!(await ensureSubscribed())) return;

    if (fp.config.no_withdraw) {
      await showModalApiKey({});
      return;
    }

    const acc = await showModalExchangeAccountSelector({ market });
    if (!acc) return;

    if (acc !== 'wisdomise' || hasIas || (await openDisclaimer())) {
      const account = !acc || acc === 'wisdomise' ? undefined : acc;
      await createFPI.mutateAsync({ fpKey: fp.key, account });
      await showActivationNotice();
    }
  };

  const { level: myLevel } = useSubscription();
  const fpLevel = fp.config.subscription_level ?? 0;

  return (
    <>
      <Button
        variant="primary"
        className={className}
        onClick={onActivateClick}
        loading={createFPI.isLoading}
        disabled={isOtherFPActive || !fp.subscribable || fpLevel > myLevel}
      >
        {t('actions.activate')}
      </Button>

      {SubscribeModal}
      {ModalExchangeAccountSelector}
      {ModalDisclaimer}
      {ModalApiKey}
      {ModalActivationNotice}
    </>
  );
};

export default ButtonActivate;
