import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateFPIMutation,
  useGetFinancialProductsQuery,
} from "api/horosApi";
import RiskCard from "containers/dashboard/components/RiskCard";
import { useGetInvestorAssetStructureQuery } from "api/horosApi";
import { ReactComponent as WarningCircleIcon } from "@images/warningCircle.svg";
import Modal from "components/modal";
import Spinner from "components/spinner";
import Congratulation from "containers/congratulation";
import { FinancialProduct } from "./types/financialProduct";

const Catalog = () => {
  const navigate = useNavigate();
  const fpsData = useGetFinancialProductsQuery({});
  const [createFPI, createFPIRes] = useCreateFPIMutation();
  const investorAsset = useGetInvestorAssetStructureQuery({});
  const [showCongratulation, setShowCongratulation] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FinancialProduct>();

  const onClickDetail = (id: string) => {
    if (!createFPIRes.isLoading) navigate(`/app/strategyCatalog/${id}`);
  };

  const onClickSubscribe = async (item: FinancialProduct) => {
    if (!createFPIRes.isLoading && item.subscribable) {
      setSelectedItem(item);
      const { data }: any = await createFPI({
        financial_product: {
          key: item?.key,
        },
      });
      if (data.key) {
        setShowCongratulation(true);
      }
    }
  };

  const onGoToDeposit = async () => {
    const res = await investorAsset.refetch();
    setShowCongratulation(false);
    navigate(`/app/deposit/${res.data?.[0]?.main_exchange_account.key}`);
  };

  const onGoToDashboard = async () => {
    await investorAsset.refetch();
    setShowCongratulation(false);
    navigate("/app/dashboard");
  };

  const currentFPKey =
    investorAsset?.data?.[0]?.financial_product_instances[0]?.financial_product
      .key;

  const isAnyFinancialProductActive =
    (investorAsset?.data?.[0]?.financial_product_instances.length || 0) > 0;

  if (fpsData.isLoading) {
    return (
      <div className="mt-[50px] flex w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div
        className="customNotification"
        style={createFPIRes.isLoading ? { right: 15 } : { right: -300 }}
      >
        <div className="flex flex-row">
          <WarningCircleIcon />
          <div className="ml-[10px] flex flex-col ">
            <p className="text-[14px] font-bold text-white">
              We’re creating a wallet for you
            </p>
            <p className="text-[14px] font-normal text-white">
              {" "}
              it may take a while …
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h2 className="mb-4 font-campton text-base text-white xl:text-xl">
          Pick your strategy
        </h2>
        <p className="mb-6 font-campton text-base text-gray-light ">
          AI-based trading strategies run automatically on your crypto account.
          These are built with our comprehensive and sophisticated AI models
          after running over 500 million unique experiments
        </p>
      </div>
      <div className="flex flex-wrap justify-between gap-4">
        {fpsData?.data?.results.map((item) => (
          <RiskCard
            id={item.key}
            key={item.key}
            showHeader={true}
            showActions={true}
            title={item.title}
            loading={fpsData.isLoading}
            minDeposit={item.min_deposit}
            maxDeposit={item.max_deposit}
            className="w-full md:w-[32%]"
            selected={currentFPKey === item.key}
            disabled={isAnyFinancialProductActive || !item.subscribable}
            maxDrawdown={item.profile.max_drawdown}
            onDetail={() => onClickDetail(item.key)}
            onSubscribe={() => onClickSubscribe(item)}
            riskRatio={item.profile.return_risk_ratio}
            expectedYield={item.profile.expected_yield}
            subscriptionLoading={
              createFPIRes.isLoading && selectedItem?.key === item.key
            }
          />
        ))}
      </div>

      {showCongratulation && (
        <Modal className="!w-full sm:!w-[600px]">
          <Congratulation
            onGoToDeposit={onGoToDeposit}
            onGoToDashboard={onGoToDashboard}
            loading={investorAsset.isFetching}
          />
        </Modal>
      )}
    </>
  );
};

export default Catalog;
