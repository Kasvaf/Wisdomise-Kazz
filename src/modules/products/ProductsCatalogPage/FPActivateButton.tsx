import type React from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import {
  useInvestorAssetStructuresQuery,
  useUpdateFPIStatusMutation,
  useCreateFPIMutation,
} from 'api';
import { type FinancialProduct } from 'api/types/financialProduct';
import Button from 'shared/Button';
import isFPRunning from './isFPRunning';
import useModalDisclaimer from './useModalDisclaimer';

interface Props {
  inDetailPage?: boolean;
  className?: string;
  financialProduct: FinancialProduct;
}

const FPActivateButton: React.FC<Props> = ({
  className,
  inDetailPage,
  financialProduct: fp,
}) => {
  const navigate = useNavigate();
  const createFPI = useCreateFPIMutation();
  const ias = useInvestorAssetStructuresQuery();
  const updateFPIStatus = useUpdateFPIStatusMutation();

  const gotoDashboardHandler = useCallback(() => {
    navigate('/app/assets');
    notification.destroy(fp.key);
  }, [navigate, fp.key]);

  const onWalletDisclaimerAccept = useCallback(async () => {
    await createFPI.mutateAsync(fp.key);
    notification.success({
      key: fp.key,
      message: 'Congratulations!',
      description: (
        <>
          <p>
            Thank you for trusting us. You can now deposit any amount to your
            account and activate any of the AI-powered strategies
          </p>

          <div className="mt-4 flex justify-around">
            <Button
              size="small"
              variant="primary"
              onClick={gotoDashboardHandler}
            >
              Dashboard
            </Button>
          </div>
        </>
      ),
      duration: 0,
    });
  }, [createFPI, fp.key, gotoDashboardHandler]);

  const onDeactivateClick = useCallback(async () => {
    if (ias.data?.[0] != null) {
      await updateFPIStatus.mutateAsync({
        fpiKey: ias.data[0].financial_product_instances[0].key,
        status: 'stop',
      });
      notification.success({
        message: 'Strategy Deactivated Successfully!',
      });
    }
  }, [ias.data, updateFPIStatus]);

  const fpis = ias.data?.[0]?.financial_product_instances;
  const isOtherFPActive =
    (fpis?.length || 0) > 0 && fp?.key !== fpis?.[0]?.financial_product.key;
  const isRunning = isFPRunning(ias.data, fp.key);

  const [ModalDisclaimer, openDisclaimer] = useModalDisclaimer();
  const onActivateClick = useCallback(async () => {
    if (await openDisclaimer()) {
      await onWalletDisclaimerAccept();
    }
  }, [openDisclaimer, onWalletDisclaimerAccept]);

  return (
    <>
      {isRunning ? (
        <Button
          className={className}
          onClick={onDeactivateClick}
          loading={updateFPIStatus.isLoading || ias.isLoading}
          disabled={isOtherFPActive || !fp.subscribable}
          variant={inDetailPage ? 'primary' : 'alternative'}
        >
          Deactivate
        </Button>
      ) : (
        <Button
          variant="primary"
          className={className}
          onClick={onActivateClick}
          loading={createFPI.isLoading}
          disabled={isOtherFPActive || !fp.subscribable}
        >
          Activate
        </Button>
      )}

      <ModalDisclaimer />
    </>
  );
};

export default FPActivateButton;
