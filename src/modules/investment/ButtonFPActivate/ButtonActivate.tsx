/* eslint-disable import/max-dependencies */
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { useInvestorAssetStructuresQuery } from 'api';
import { type FinancialProduct } from 'api/types/financialProduct';
import { trackClick } from 'config/segment';
import Button from 'shared/Button';
import useModalApiKey from './useModalApiKey';
import useEnsureSubscription from './useEnsureSubscription';

interface Props {
  inDetailPage?: boolean;
  className?: string;
  financialProduct: FinancialProduct;
  onCreate: () => void;
}

const ButtonActivate: React.FC<Props> = ({
  className,
  financialProduct: fp,
  onCreate,
}) => {
  const { t } = useTranslation('products');
  const ias = useInvestorAssetStructuresQuery();

  const fpis = ias.data?.[0]?.financial_product_instances;
  const isOtherFPActive =
    (fpis?.length || 0) > 0 && fp?.key !== fpis?.[0]?.financial_product.key;

  const [ModalApiKey, showModalApiKey] = useModalApiKey();
  const [SubscribeModal, ensureSubscribed] = useEnsureSubscription(fp);

  const onActivateClick = async () => {
    trackClick('activate_strategy_button')();
    if (!(await ensureSubscribed())) return;

    if (fp.config.no_withdraw) {
      await showModalApiKey({});
      return;
    }

    onCreate();
  };

  return (
    <>
      <Button
        variant="primary"
        className={className}
        onClick={onActivateClick}
        disabled={isOtherFPActive || !fp.subscribable}
      >
        {t('actions.activate')}
      </Button>

      {SubscribeModal}
      {ModalApiKey}
    </>
  );
};

export default ButtonActivate;
