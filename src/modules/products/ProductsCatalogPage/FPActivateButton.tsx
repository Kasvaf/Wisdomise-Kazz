import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { ModalV2 } from 'shared/ModalV2';
import { Button } from 'shared/Button';
import {
  useInvestorAssetStructuresQuery,
  useUpdateFPIStatusMutation,
  useCreateFPIMutation,
} from 'api';
import { type FinancialProduct } from 'api/types/financialProduct';
import { isFPRunning } from './utils';

interface Props {
  inDetailPage?: boolean;
  className?: string;
  financialProduct: FinancialProduct;
}

export const FPActivateButton: React.FC<Props> = ({
  className,
  inDetailPage,
  financialProduct: fp,
}) => {
  const navigate = useNavigate();
  const createFPI = useCreateFPIMutation();
  const ias = useInvestorAssetStructuresQuery();
  const updateFPIStatus = useUpdateFPIStatusMutation();
  const [showWalletDisclaimerDialog, setShowWalletDisclaimerDialog] =
    useState(false);

  const onWalletDisclaimerAccept = async () => {
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
              variant="secondary"
              onClick={() => {
                navigate('/app/assets');
                notification.destroy(fp.key);
              }}
            >
              Dashboard
            </Button>
          </div>
        </>
      ),
      duration: 0,
    });
  };

  const onDeactivateClick = async () => {
    if (ias.data?.[0] != null) {
      await updateFPIStatus.mutateAsync({
        fpiKey: ias.data[0].financial_product_instances[0].key,
        status: 'stop',
      });
      notification.success({
        message: 'Strategy Deactivated Successfully!',
      });
    }
  };

  const fpis = ias.data?.[0]?.financial_product_instances;
  const isOtherFPActive =
    (fpis?.length || 0) > 0 && fp?.key !== fpis?.[0]?.financial_product.key;
  const isRunning = isFPRunning(ias.data, fp.key);

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
          onClick={() => {
            setShowWalletDisclaimerDialog(true);
          }}
          loading={createFPI.isLoading}
          disabled={isOtherFPActive || !fp.subscribable}
        >
          Activate
        </Button>
      )}
      <ModalV2
        open={showWalletDisclaimerDialog}
        footer={false}
        onCancel={() => {
          setShowWalletDisclaimerDialog(false);
        }}
      >
        <div className="">
          <h1 className="mb-6 text-center text-[#F1AA40]">Attention</h1>
          <div className="h-[14rem] overflow-auto text-white">
            Your wallet will be opened on Binance. Wisdomise (Switzerland) AG
            itself does not provide any wallet and / or custody services. Please
            note that the cryptocurrencies you transfer to this wallet will be
            stored on Binance. Binance is a third party crypto exchange provider
            that is not regulated in Switzerland. Hence, there are risks
            associated with holding a wallet on Binance. The risks associated
            with Binance cannot be controlled by Wisdomise (Switzerland) AG.
            Such risks may include but are not limited to:
            <br />
            - bankruptcy of Binance;
            <br />
            - unauthorized access to the wallet held on Binance by third parties
            due to a hacker attack or similar event;
            <br />- prohibition of the operation of its business by a public
            authority. These risks include the risk of significant or total loss
            of the cryptocurrencies transferred to the wallet on Binance. By
            creating a wallet to use Wisdomise’s services you agree to bear all
            risks associated with holding the cryptocurrencies in a wallet on
            Binance. Wisdomise (Switzerland) AG accepts no liability whatsoever
            for any damage incurred in connection with holding the
            cryptocurrencies in a wallet on Binance.
          </div>
          <div className="mt-4 text-center">
            <Button
              onClick={() => {
                setShowWalletDisclaimerDialog(false);
                onWalletDisclaimerAccept();
              }}
            >
              Accept
            </Button>
          </div>
        </div>
      </ModalV2>
    </>
  );
};
