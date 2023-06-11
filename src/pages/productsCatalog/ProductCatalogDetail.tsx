import LineChart from "containers/dashboard/components/LineChart/LineChart";
import { useParams } from "react-router-dom";
import { CoinsIcons } from "shared/components/Coins";
import { PageWrapper } from "shared/components/PageWrapper";
import { FPActivateButton } from "./FPActivateButton";
import { useFinancialProductQuery, useFPBacktestQuery } from "./services";

const ProductCatalogDetail = () => {
  const params = useParams<{ fpKey: string }>();
  const fpKey = params.fpKey!;
  const fp = useFinancialProductQuery(fpKey);
  const backtest = useFPBacktestQuery(fpKey);

  const rrr = fp.data?.profile.return_risk_ratio;

  return (
    <PageWrapper loading={fp.isLoading}>
      <h1 className="text-xl font-semibold text-white">{fp.data?.title}</h1>
      <div className="mb-7 flex">
        <div className="basis-2/3">
          <p className="font- mt-6 text-sm text-white/60 ">
            {fp.data?.description}
          </p>
        </div>

        <div className="flex basis-1/3 items-end justify-end">
          <FPActivateButton
            inDetailPage
            className="w-1/2"
            financialProduct={fp.data!}
          />
        </div>
      </div>
      <div className="flex">
        <div className="basis-2/3">
          <div className="h-full rounded-3xl bg-white/5 p-8">
            <LineChart
              className="w-full"
              title={fp.data?.title}
              chartData={backtest.data}
              loading={backtest.isLoading}
            />
          </div>
        </div>

        <div className="flex basis-1/3 flex-col gap-4 pl-4">
          <div className="flex items-center rounded-3xl bg-white/5 p-2 ">
            <CoinsIcons coins={fp.data?.config.assets || ""} />
          </div>

          <div className="flex gap-2 text-base font-medium">
            <div
              className={`basis-1/2 rounded-full px-5 py-4 text-center text-white/80 ${
                rrr === "High"
                  ? "bg-[#F1AA404D]"
                  : rrr === "Medium"
                  ? "bg-[#74ABFF33]"
                  : "bg-[#40F19C4D]"
              }`}
            >
              {rrr + " Risk"}
            </div>

            <div className="basis-1/2 rounded-full bg-[#FFFFFF1A] px-5 py-4 text-center  text-white/80">
              Spot
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 p-8 text-sm font-medium">
            <div className="mb-4 flex justify-between">
              <p className="text-white">Expected Yield (APY)</p>
              <p className="text-[#40F19C]">
                {fp?.data?.profile.expected_yield}
              </p>
            </div>

            <div className="flex justify-between">
              <p className="text-white">Expected Max Drawdown</p>
              <p className="text-white">{fp?.data?.profile.max_drawdown}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 p-8 text-sm">
            <p className=" font-medium text-white/80">Investment Limits</p>
            <div className="my-4 flex justify-between">
              <span className="text-white/40">Minimum</span>
              <span className="font-medium text-white">
                {fp.data?.min_deposit} BUSD
              </span>
            </div>
            <div className="my-4 mb-0 flex justify-between">
              <span className="flex justify-between text-white/40">
                Maximum
              </span>
              <span className="font-medium text-white">
                {fp.data?.max_deposit} BUSD
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ProductCatalogDetail;
