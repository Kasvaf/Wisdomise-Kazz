import { notification } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "shared/components/Button";
import {
  useInvestorAssetStructuresQuery,
  useUpdateFPIStatusMutation,
} from "shared/services";
import { useCreateFPIMutation } from "./services";
import { FinancialProduct } from "./types/financialProduct";
import { isFPRunning } from "./utils";

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

  const onActivateClick = async () => {
    await createFPI.mutateAsync(fp.key);
    const { data } = await ias.refetch();
    notification.success({
      key: fp.key,
      message: "Congratulations!",
      description: (
        <>
          <p>
            Thank you for trusting us. You can now deposit any amount to your
            account and activate any of the AI-powered strategies
          </p>

          <div className="mt-4 flex justify-around">
            <Button
              size="small"
              onClick={() => {
                notification.destroy(fp.key);
                navigate(
                  `/app/deposit/${data?.[0]?.main_exchange_account.key}`
                );
              }}
            >
              Go To Deposit
            </Button>
            <Button
              size="small"
              variant="secondary"
              onClick={() => {
                navigate("/app/dashboard");
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
    if (ias.data?.[0]) {
      await updateFPIStatus.mutateAsync({
        fpiKey: ias.data[0].financial_product_instances[0].key,
        status: "stop",
      });
      notification.success({
        message: "Financial Product Deactivated Successfully!",
      });
    }
  };

  const fpis = ias.data?.[0]?.financial_product_instances;
  const isOtherFPActive =
    (fpis?.length || 0) > 0 && fp?.key !== fpis?.[0]?.financial_product.key;
  const isRunning = isFPRunning(ias.data, fp.key);

  return isRunning ? (
    <Button
      className={className}
      onClick={onDeactivateClick}
      loading={updateFPIStatus.isLoading}
      disabled={isOtherFPActive || !fp.subscribable}
      variant={inDetailPage ? "primary" : "alternative"}
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
  );
};
