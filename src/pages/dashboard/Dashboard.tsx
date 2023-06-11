import Balance from "containers/dashboard/components/balance/Balance";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "shared/components/Button";
import {
  useInvestorAssetStructuresQuery,
  useUpdateFPIStatusMutation,
} from "shared/services";
import TradeSrc from "./trade.svg";
// import Tag from "components/Tag";
// import { getKycLevelStatusColor, isPendingOrRejected } from "utils/utils";
// import { NotificationManager } from "react-notifications";
// import { TOAST_TIME } from "components/constants";

const enum IAS_STATUS {
  stop = "stop",
  start = "start",
  pause = "pause",
  resume = "resume",
}

function Dashboard() {
  const navigate = useNavigate();
  const ias = useInvestorAssetStructuresQuery();
  const updateFPIStatus = useUpdateFPIStatusMutation();
  const fpi = ias.data?.[0]?.financial_product_instances[0];

  const onClickStatus = async (status: keyof typeof IAS_STATUS) => {
    if (updateFPIStatus.isLoading) return;
    if (fpi) {
      await updateFPIStatus.mutateAsync({
        fpiKey: fpi.key,
        status,
      });
      await ias.refetch();
    }
  };

  useEffect(() => {
    if (updateFPIStatus.isSuccess) ias.refetch();
  }, [updateFPIStatus.isSuccess]);

  useEffect(() => {
    ias.refetch();
  }, []);

  if (ias.isLoading) return <div />;

  return (
    <div className="flex h-full w-full flex-row justify-center">
      <div className="flex w-full flex-col ">
        {!fpi ? (
          <div className="flex h-auto w-full flex-col items-center justify-between rounded-3xl bg-white/5 px-8 py-6 sm:flex-row">
            <div className="flex flex-col ">
              <h1 className="text-[40px] font-bold text-white">
                We Trade On Your Behalf!
              </h1>
              <p className="my-5 w-auto text-lg  text-gray-light">
                Wisdomise offers AI-based strategies tailored to your risk
                tolerance. Check out our Financial Products and start making
                profit today
              </p>
              <Button
                className="self-start"
                onClick={() => navigate("/app/products-catalog")}
              >
                Check Products
              </Button>
            </div>
            <img src={TradeSrc} className="w-[250px]" alt="trade" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <div className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white/5 p-5 sm:w-auto">
              <div className="flex flex-col">
                <p className="mb-1 text-gray-light">
                  Current strategy (
                  {updateFPIStatus.isLoading ? "UPDATING" : fpi?.status})
                </p>
                <h5 className="text-base text-white">
                  {fpi?.financial_product.title}
                </h5>
              </div>
              <div className="flex">
                <p
                  onClick={() => {
                    onClickStatus(
                      fpi.status === "RUNNING"
                        ? IAS_STATUS.pause
                        : IAS_STATUS.resume
                    );
                  }}
                  className={`cursor-pointer font-bold uppercase text-primary ${
                    ["DRAFT", "STOPPED"].includes(fpi?.status) && "invisible"
                  }
                  ${updateFPIStatus.isLoading && "opacity-40"}`}
                >
                  {fpi.status === "RUNNING" ? "PAUSE" : "RESUME"}
                </p>
                {fpi.status === "DRAFT" && (
                  <p
                    onClick={() => {
                      onClickStatus(IAS_STATUS.stop);
                    }}
                    className={`ml-2 cursor-pointer font-bold uppercase text-primary
                  ${updateFPIStatus.isLoading && "opacity-40"}
                  `}
                  >
                    Deactivate
                  </p>
                )}
                <p
                  onClick={() => {
                    onClickStatus(
                      fpi.status === "DRAFT"
                        ? IAS_STATUS.start
                        : IAS_STATUS.stop
                    );
                  }}
                  className={`ml-2 cursor-pointer font-bold uppercase text-primary
                  ${updateFPIStatus.isLoading && "opacity-40"}
                  `}
                >
                  {fpi.status === "DRAFT" ? "START" : "STOP"}
                </p>
              </div>
            </div>
          </div>
        )}
        {!!fpi && <Balance />}
      </div>
    </div>
  );
}

export default Dashboard;
