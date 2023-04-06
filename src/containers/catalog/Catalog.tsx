import { useState, FunctionComponent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetETFPackagesQuery } from "api/horosApi";
import RiskCard from "containers/dashboard/components/RiskCard";
import {
  useGetInvestorAssetStructureQuery,
  useCreateInvestorAssetMutation,
} from "api/horosApi";
import { ReactComponent as WarningCircleIcon } from "@images/warningCircle.svg";
import Modal from "components/modal";
import Spinner from "components/spinner";
import WaitListBox from "components/WaitListBox";
import Congratulation from "containers/congratulation";

const Catalog: FunctionComponent = () => {
  const [selectedItem, setSelectedItem] = useState<any>();
  const [showWaitList, setShowWaitList] = useState(false);
  const [showCongratulation, setShowCongratulation] = useState(false);

  const [createInvestorAsset, createAsset] = useCreateInvestorAssetMutation();
  const investorAsset = useGetInvestorAssetStructureQuery({});
  const etfData = useGetETFPackagesQuery({});

  const navigate = useNavigate();

  const isETFPackages = (): boolean => {
    return (
      investorAsset?.data &&
      investorAsset?.data.results.length > 0 &&
      investorAsset?.data.results[0].etf_package_bindings.length > 0
    );
  };

  const isWaitingList = () => {
    return (
      investorAsset?.data &&
      investorAsset?.data.results.length > 0 &&
      investorAsset?.data.results[0].waiting_list.key
    );
  };

  const checkCurrentETF = () => {
    if (investorAsset?.data && investorAsset?.data.results.length > 0) {
      const currentPackage = etfData?.data?.results.find(
        (item: any) =>
          item.key ===
          investorAsset?.data.results[0].etf_package_bindings[0]?.etf_package
            ?.key
      );
      if (currentPackage) return currentPackage.key;
    }
  };
  const onClickDetail = (id: number) => {
    if (!createAsset.isLoading) navigate(`/app/strategyCatalog/${id}`);
  };

  const onClickSubscribe = (item: any) => {
    if (!createAsset.isLoading) setSelectedItem(item);
  };

  useEffect(() => {
    if (selectedItem) {
      if (!selectedItem.subscribable) {
        setShowWaitList(true);
      } else {
        onCliCkCreateWallet();
      }
    }
  }, [selectedItem]);

  const onCliCkCreateWallet = async () => {
    const body = {
      etf_package_key: selectedItem.key,
    };
    const { data }: any = await createInvestorAsset(body);

    const key =
      data?.results &&
      data?.results[0].trader_instances[0].exchange_account.key;
    if (key) {
      setShowCongratulation(true);
    }
  };

  const onGoToDeposit = () => {
    const key =
      createAsset.data?.results[0].trader_instances[0].exchange_account.key;
    setShowCongratulation(false);
    navigate(`/app/deposit/${key}`);
  };

  const onGoToDashboard = async () => {
    await investorAsset.refetch();
    setShowCongratulation(false);
    navigate("/app/dashboard");
  };

  const onDoneWaitList = async () => {
    await etfData?.refetch();
  };

  if (etfData.isLoading)
    return (
      <div className="mt-[50px] flex w-full items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <>
      <div
        className="customNotification"
        style={createAsset.isLoading ? { right: 15 } : { right: -300 }}
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
        {etfData?.data?.results.map((item: any) => {
          return (
            <RiskCard
              selected={checkCurrentETF() === item.key}
              key={item.key}
              showActions={true}
              showHeader={true}
              title={item.title}
              loading={etfData.isLoading}
              id={item.key}
              expectedYield={item.profile.expected_yield}
              maxDrawdown={item.profile.max_drawdown}
              riskRatio={item.profile.return_risk_ratio}
              onDetail={() => onClickDetail(item.key)}
              onSubscribe={() => onClickSubscribe(item)}
              className="w-full md:w-[32%]"
              disabled={isETFPackages() || isWaitingList()}
              minDeposit={item.min_deposit}
              maxDeposit={item.max_deposit}
              subscriptionLoading={
                createAsset.isLoading && selectedItem.key === item.key
              }
            />
          );
        })}
      </div>

      {showWaitList && (
        <Modal className="sm:!w-[600px]">
          <WaitListBox
            onClose={() => setShowWaitList(false)}
            onDone={() => onDoneWaitList()}
            packageKey={selectedItem.key}
          />
        </Modal>
      )}

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
