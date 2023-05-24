import { useEffect } from "react";
import Preview from "./components/Preview";
import { useNavigate } from "react-router-dom";
import Balance from "./components/balance";
import {
  useGetInvestorAssetStructureQuery,
  useGetUserInfoQuery,
  useUpdateIASStatusMutation,
  useGetKycLevelsQuery,
} from "api/horosApi";
import { BUTTON_TYPE } from "utils/enums";
import Button from "components/Button";
import Trade from "@images/Trade.png";
import Tag from "components/Tag";
import { VerificationStatus } from "../../types/kyc";
import { getKycLevelStatusColor, isPendingOrRejected } from "utils/utils";
// import { NotificationManager } from "react-notifications";
// import { TOAST_TIME } from "components/constants";

const enum IAS_STATUS {
  DRAFT = "DRAFT",
  RUNNING = "RUNNING",
  STOPPED = "STOPPED",
}

function Dashboard() {
  const navigate = useNavigate();
  const investorAsset = useGetInvestorAssetStructureQuery({});
  const [UpdateIASStatusExecutor, UpdatedIASStatus] =
    useUpdateIASStatusMutation();
  const { data: userInfo } = useGetUserInfoQuery({});
  const { data: kycLevels } = useGetKycLevelsQuery({});

  const getCtaTitle = (status: VerificationStatus | undefined): string => {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return "Verified";
      case VerificationStatus.REJECTED:
        return "Verify Now";
      case VerificationStatus.UNVERIFIED:
        return "Verify Now";
      case VerificationStatus.PENDING:
        return "In Progress";
      default:
        return "Verify";
    }
  };

  const kycLevel = userInfo?.kyc_level_bindings[0];

  // const checkHasTotalBalance = () => {
  //   return (
  //     investorAsset?.data?.results[0]?.trader_instances?.[0]?.exchange_account
  //       ?.total_equity > 0
  //   );
  // };

  const onClickStatus = async (status: keyof typeof IAS_STATUS) => {
    if (UpdatedIASStatus.isLoading) return;
    // if (checkHasTotalBalance()) {
    await UpdateIASStatusExecutor({
      key: investorAsset?.data?.results[0]?.trader_instances[0]?.key,
      status,
    });
    // } else {
    //   NotificationManager.error(
    //     "For starting your strategy you must first deposit .",
    //     "",
    //     TOAST_TIME
    //   );
    // }
  };

  useEffect(() => {
    if (UpdatedIASStatus.isSuccess) investorAsset.refetch();
  }, [UpdatedIASStatus.isSuccess]);

  if (investorAsset.isLoading) return <div />;

  const instances = investorAsset?.data?.results?.[0]?.trader_instances || [];
  const showBalance = Array.isArray(instances) && instances.length > 0;

  return (
    <div className="flex h-full w-full flex-row justify-center">
      <div className="flex w-full flex-col ">
        {investorAsset?.data?.results?.length === 0 ||
        investorAsset?.data?.results[0]?.trader_instances.length === 0 ? (
          <div className="flex h-auto w-full flex-col items-center justify-between bg-gray-dark px-12 py-8 sm:flex-row">
            <div className="flex flex-col ">
              <h1 className="text-[40px] font-bold text-white">
                We trade on your behalf!
              </h1>
              <p className="my-5 w-auto text-lg  text-gray-light">
                Wisdomise offers AI-based strategies tailored to your risk
                tolerance. Check out our strategies and start making profit
                today
              </p>
              <Button
                type={BUTTON_TYPE.FILLED}
                text="SEE Strategies"
                className="!w-[200px]"
                onClick={() => navigate("/app/strategyCatalog")}
              />
            </div>
            <img src={Trade} className="h-[300px] w-[300px]" alt="trade" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <p className="mb-6 w-auto font-campton text-base text-gray-light sm:w-[500px]">
              Wisdomise helps you optimize your basket of cryptocurrencies and
              trade them profitably.
            </p>

            <div className="flex w-full items-center justify-between gap-2 rounded-xl bg-gray-dark p-5 sm:w-auto">
              <div className="flex flex-col">
                <p className="mb-1 text-gray-light">
                  Current strategy (
                  {UpdatedIASStatus.isLoading
                    ? "UPDATING"
                    : investorAsset?.data &&
                      investorAsset?.data?.results[0]?.trader_instances[0]
                        ?.status}
                  )
                </p>
                <h5 className="text-base text-white">
                  {investorAsset?.data &&
                    investorAsset?.data?.results[0].etf_package_bindings[0]
                      .etf_package.title}
                </h5>
              </div>
              <div className="flex">
                <p
                  onClick={() => {
                    if (
                      investorAsset?.data &&
                      investorAsset?.data?.results[0]?.trader_instances[0]
                        ?.status === "RUNNING"
                    ) {
                      onClickStatus(IAS_STATUS.STOPPED);
                    }
                  }}
                  className={` font-bold uppercase ${
                    investorAsset?.data &&
                    investorAsset?.data?.results[0]?.trader_instances[0]
                      ?.status === "RUNNING"
                      ? "cursor-pointer text-primary"
                      : "text-gray-light opacity-40"
                  }
                  ${UpdatedIASStatus.isLoading && "opacity-40"}`}
                >
                  stop
                </p>
                <p
                  onClick={() => {
                    if (
                      investorAsset?.data?.results[0]?.trader_instances[0]
                        ?.status !== "RUNNING"
                    ) {
                      onClickStatus(IAS_STATUS.RUNNING);
                    }
                  }}
                  className={`ml-2  font-bold uppercase ${
                    investorAsset?.data &&
                    investorAsset?.data?.results[0]?.trader_instances[0]
                      ?.status === "RUNNING"
                      ? "text-gray-light opacity-40"
                      : "cursor-pointer text-primary"
                  }
                  ${UpdatedIASStatus.isLoading && "opacity-40"}
                  `}
                >
                  start
                </p>
              </div>
            </div>
          </div>
        )}
        {/*
					! KYC banner and CTA test cases:
					https://app.clickup.com/t/860q3myqg?block=block-fc7b1579-0a62-4216-a657-a60798969370
				*/}
        {/* {kycLevel?.status !== VerificationStatus.VERIFIED && (
          <div className="referral-panel mt-4 flex flex-col items-center gap-4 px-5 py-6 md:flex-row">
            <div className="flex flex-col">
              <div className="flex">
                <p className="flex items-center text-lg text-white md:text-xl">
                  <span className="ml-1 text-2xl text-white">KYC</span>
                </p>
                {!isPendingOrRejected(kycLevel?.status) && (
                  <div className="ml-3 flex">
                    {kycLevel?.status && (
                      <Tag color={getKycLevelStatusColor(kycLevel.status)}>
                        {kycLevel.status}
                      </Tag>
                    )}
                  </div>
                )}
              </div>
              {!isPendingOrRejected(kycLevel?.status) && (
                <p className="pl-1 pt-2 text-base text-white/80">
                  KYC (Know Your Customer) is today a significant element in the
                  fight against financial crime and money laundering, and
                  customer identification is the most critical aspect as it is
                  the first step to better perform in the other stages of the
                  process.
                </p>
              )}
              {kycLevel?.status === VerificationStatus.PENDING && (
                <p className="pl-1 pt-2 text-base text-white/80">
                  We are now checking your documents for KYC verification. This
                  process may take some time. Please wait until the process is
                  complete.
                </p>
              )}
              {kycLevel?.status === VerificationStatus.REJECTED && (
                <p className="pl-1 pt-2 text-base text-white/80">
                  We checked your documents for KYC verification, but
                  unfortunately your identity verification request has been
                  rejected. Please reach out to support if you want to try
                  again.
                </p>
              )}
            </div>
            <div className="flex-1" />
            <div className="ml-3 flex">
              {isPendingOrRejected(kycLevel?.status) && (
                <Tag color={getKycLevelStatusColor(kycLevel?.status)}>
                  {kycLevel?.status}
                </Tag>
              )}
              {!isPendingOrRejected(kycLevel?.status) && (
                <Button
                  type={BUTTON_TYPE.FILLED}
                  className={"max-w-[140px]"}
                  text={getCtaTitle(kycLevel?.status)}
                  onClick={() =>
                    navigate(
                      "/app/kyc/verification?level=" +
                        (kycLevel?.kyc_level.name || kycLevels?.results[0].name)
                    )
                  }
                ></Button>
              )}
            </div>
          </div>
        )} */}
        {showBalance && <Balance />}
        <div className="dashboard-panel-wrapper flex flex-col justify-start space-y-8">
          <Preview />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
