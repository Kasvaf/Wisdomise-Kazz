import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Skeleton } from "antd";
import RiskCard from "containers/dashboard/components/RiskCard";
import LineChart from "containers/dashboard/components/LineChart";
import Button from "components/Button";
import { BUTTON_TYPE } from "utils/enums";
import { coins } from "containers/dashboard/constants";
import {
  useGetETFBacktestQuery,
  useGetETFPackageDetailQuery,
  useGetInvestorAssetStructureQuery,
  useCreateInvestorAssetMutation,
} from "api/horosApi";
import { convertDate } from "utils/utils";
import Modal from "components/modal";
import Congratulation from "containers/congratulation";
import WaitListBox from "components/WaitListBox";
import { ReactComponent as WarningCircleIcon } from "@images/warningCircle.svg";

const RiskDetail: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [showWaitList, setShowWaitList] = useState(false);
  const [showCongratulation, setShowCongratulation] = useState(false);

  const [createInvestorAsset, createAsset] = useCreateInvestorAssetMutation();

  const investorAsset = useGetInvestorAssetStructureQuery({});
  const etfData = useGetETFPackageDetailQuery({ id: params.id });
  const etfBacktest = useGetETFBacktestQuery({
    id: params.id,
    params: {
      start_date: convertDate(
        new Date(import.meta.env.VITE_BACKTEST_START_DATE)
      ),
      end_date: convertDate(),
    },
  });

  const isETFPackages = (): boolean => {
    return (
      investorAsset?.data &&
      investorAsset?.data.results.length > 0 &&
      investorAsset?.data.results[0].etf_package_bindings.length > 0
    );
  };

  const onClickCreateWallet = async () => {
    const body = {
      etf_package_key: params.id,
    };
    const { data }: any = await createInvestorAsset(body);
    const key =
      data?.results &&
      data?.results[0].trader_instances[0].exchange_account.key;
    if (key) {
      setShowCongratulation(true);
    }
  };

  const onGoToDeposit = async () => {
    await investorAsset.refetch();
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

  const onActivateClick = () => {
    if (etfData.data.subscribable) {
      onClickCreateWallet();
    } else {
      setShowWaitList(true);
    }
  };

  const coinIcons: string[] = etfData.data?.config.assets
    .split("#")
    .map((str: string) => str.split("_"))
    .map((parts: string[]) => parts[1])
    .map((coin: string) => coin.toUpperCase())
    .filter((coin: string) => coin in coins)
    .map((coin: string) => coins[coin].icon);

  const uniqueCoinIcons = Array.from(new Set(coinIcons));

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
      <div className="mx-2 mt-[100px] flex grid-cols-10  flex-col items-center justify-center sm:mx-[100px]">
        {etfData.isLoading ? (
          <Skeleton.Input className=" mb-4 rounded" active />
        ) : (
          <h2 className="mb-4  text-center text-4xl capitalize text-white">
            {etfData?.data?.title}
          </h2>
        )}

        <p className="w-390  mb-6 w-auto  text-center text-base text-gray-light sm:w-[550px]">
          {etfData?.data?.description}
        </p>
        <div className="risk-detail-coins my-10">
          <Avatar.Group>
            {uniqueCoinIcons.map((icon: string) => (
              <Avatar key={icon} size="large" src={icon} />
            ))}
          </Avatar.Group>
        </div>
        <Button
          type={BUTTON_TYPE.FILLED}
          text={createAsset.isLoading ? "Loading..." : "Activate"}
          className="mb-5 w-[340px] sm:mb-20"
          disabled={createAsset.isLoading || isETFPackages()}
          onClick={onActivateClick}
        ></Button>
        <RiskCard
          expectedYield={etfData?.data?.profile.expected_yield}
          maxDrawdown={etfData?.data?.profile.max_drawdown}
          riskRatio={etfData?.data?.profile.return_risk_ratio}
          loading={etfData.isLoading}
          className="sm:w-[820px]"
        />
        <div className="my-5  w-full bg-gray-dark p-5 sm:w-[820px]">
          {etfData.isLoading ? (
            <Skeleton.Input className=" mb-4 rounded" active />
          ) : (
            <h1 className="mb-3 text-xl text-white">
              {etfData?.data?.title} vs. Benchmarks
            </h1>
          )}

          <LineChart
            className="w-full"
            chartData={etfBacktest?.data}
            loading={etfBacktest.isLoading}
            title={etfData?.data?.title}
          />
        </div>
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
      {showWaitList && (
        <Modal className="!w-full sm:!w-[600px]">
          <WaitListBox
            onClose={() => setShowWaitList(false)}
            onDone={onDoneWaitList}
            packageKey={params.id}
          />
        </Modal>
      )}
    </>
  );
};

export default RiskDetail;
