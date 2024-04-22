/* eslint-disable import/max-dependencies */
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useInvestorAssetStructuresQuery, useCreateFPIMutation } from 'api';
import { type FinancialProduct } from 'api/types/financialProduct';
import { trackClick } from 'config/segment';
import Button from 'shared/Button';
import useModalApiKey from './useModalApiKey';
import useModalDisclaimer from './useModalDisclaimer';
import useEnsureSubscription from './useEnsureSubscription';
import useModalFpActivation from './useModalFpActivation';

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

  const fpis = ias.data?.[0]?.financial_product_instances;
  const isOtherFPActive =
    (fpis?.length || 0) > 0 && fp?.key !== fpis?.[0]?.financial_product.key;

  const [ModalFpActivation, showModalFpActivation] = useModalFpActivation();
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

    const acc = await showModalFpActivation({ financialProduct: fp });
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
      {ModalFpActivation}
      {ModalDisclaimer}
      {ModalApiKey}
    </>
  );
};

export default ButtonActivate;
