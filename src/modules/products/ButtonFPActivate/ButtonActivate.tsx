/* eslint-disable import/max-dependencies */
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useInvestorAssetStructuresQuery, useCreateFPIMutation } from 'api';
import { type FinancialProduct } from 'api/types/financialProduct';
import { trackClick } from 'config/segment';
import Button from 'shared/Button';
import useModalExchangeAccountSelector from 'modules/account/useModalExchangeAccountSelector';
import useModalApiKey from './useModalApiKey';
import useModalDisclaimer from './useModalDisclaimer';
import useEnsureSubscription from './useEnsureSubscription';

interface Props {
  inDetailPage?: boolean;
  className?: string;
  financialProduct: FinancialProduct;
  onSuccess?: () => void;
}

const ButtonActivate: React.FC<Props> = ({
  className,
  financialProduct: fp,
  onSuccess,
}) => {
  const { t } = useTranslation('products');
  const createFPI = useCreateFPIMutation();
  const ias = useInvestorAssetStructuresQuery();
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
  const [SubscribeModal, ensureSubscribed] = useEnsureSubscription(fp);

  const onActivateClick = async () => {
    trackClick('activate_strategy_button')();
    if (!(await ensureSubscribed())) return;

    if (fp.config.no_withdraw) {
      await showModalApiKey({});
      return;
    }

    const acc = await showModalExchangeAccountSelector({ market });
    if (!acc) return;

    trackClick('activate_strategy_wallet', {
      wallet_type: acc === 'wisdomise' ? acc : 'binance',
    })();

    if (acc !== 'wisdomise' || hasIas || (await openDisclaimer())) {
      const account = !acc || acc === 'wisdomise' ? undefined : acc;
      await createFPI.mutateAsync({ fpKey: fp.key, account });
      onSuccess?.();
    }
  };

  return (
    <>
      <Button
        variant="primary"
        className={className}
        onClick={onActivateClick}
        loading={createFPI.isLoading}
        disabled={isOtherFPActive || !fp.subscribable}
      >
        {t('actions.activate')}
      </Button>

      {SubscribeModal}
      {ModalExchangeAccountSelector}
      {ModalDisclaimer}
      {ModalApiKey}
    </>
  );
};

export default ButtonActivate;
