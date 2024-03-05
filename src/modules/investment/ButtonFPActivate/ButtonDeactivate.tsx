/* eslint-disable import/max-dependencies */
import type React from 'react';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  useInvestorAssetStructuresQuery,
  useUpdateFPIStatusMutation,
} from 'api';
import { type FinancialProduct } from 'api/types/financialProduct';
import Button from 'shared/Button';

interface Props {
  inDetailPage?: boolean;
  className?: string;
  financialProduct: FinancialProduct;
}

const ButtonDeactivate: React.FC<Props> = ({
  className,
  inDetailPage,
  financialProduct: fp,
}) => {
  const { t } = useTranslation('products');
  const ias = useInvestorAssetStructuresQuery();
  const updateFPIStatus = useUpdateFPIStatusMutation();

  const onDeactivateClick = async () => {
    if (ias.data?.[0] != null) {
      await updateFPIStatus.mutateAsync({
        fpiKey: ias.data[0].financial_product_instances[0].key,
        status: 'stop',
      });
      notification.success({
        message: t('notification-deactivated.message'),
      });
    }
  };

  const fpis = ias.data?.[0]?.financial_product_instances;
  const isOtherFPActive =
    (fpis?.length || 0) > 0 && fp?.key !== fpis?.[0]?.financial_product.key;

  return (
    <>
      <Button
        className={className}
        onClick={onDeactivateClick}
        loading={updateFPIStatus.isLoading || ias.isLoading}
        disabled={isOtherFPActive || !fp.subscribable}
        variant={inDetailPage ? 'primary' : 'alternative'}
      >
        {t('actions.deactivate')}
      </Button>
    </>
  );
};

export default ButtonDeactivate;
