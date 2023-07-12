import { useParams } from "react-router-dom";
import { CoinsIcons } from "shared/components/CoinsIcons";
import { PageWrapper } from "shared/components/PageWrapper";
import { PriceChange } from "shared/components/priceChange/PriceChange";
import { FPActivateButton } from "./FPActivateButton";
import { useFinancialProductQuery } from "./services";

const ProductCatalogDetail = () => {
  const params = useParams<{ fpKey: string }>();
  const fpKey = params.fpKey!;
  const fp = useFinancialProductQuery(fpKey);
  // const backtest = useFPBacktestQuery(fpKey);

  const rrr = fp.data?.profile.return_risk_ratio;

  return (
    <PageWrapper loading={fp.isLoading}>
      <h1 className="text-base font-semibold text-white">{fp.data?.title}</h1>

      <div className="mb-7 flex mobile:flex-col">
        <div className="basis-2/3 mobile:basis-auto">
          <p className="mt-6 text-sm text-white/60 ">{fp.data?.description}</p>
        </div>

        <div className="flex basis-1/3 items-end justify-end mobile:mt-8 mobile:basis-auto">
          <FPActivateButton inDetailPage className="w-1/2" financialProduct={fp.data!} />
        </div>
      </div>

      <div className="flex mobile:flex-col">
        <div className="basis-2/3 mobile:order-2 mobile:basis-auto">
          <div className="flex h-full items-center justify-center rounded-3xl bg-white/5 p-8">
            <p className="text-white">
              Backtest <span className="rounded-3xl bg-white/20 p-2 text-white/40">Soon</span>
            </p>
            {/* <LineChart
              className="w-full"
              title={fp.data?.title}
              chartData={backtest.data}
              loading={backtest.isLoading}
            /> */}
          </div>
        </div>

        <div className="flex basis-1/3 flex-col gap-4 pl-4 mobile:order-1 mobile:mb-4 mobile:basis-auto mobile:pl-0">
          <div className="flex items-center rounded-3xl bg-white/5 p-2">
            <CoinsIcons coins={fp.data?.config.assets || ""} />
          </div>

          <div className="flex gap-2 text-base font-medium">
            <div
              className={`basis-1/2 rounded-full px-4 py-3 text-center ${
                rrr === "High"
                  ? "bg-[#F1AA4033] text-[#F1AA40]"
                  : rrr === "Medium"
                  ? "bg-[#74ABFF33] text-[#34A3DA]"
                  : "bg-[#40F19C33] text-[#40F19C]"
              }`}
            >
              {rrr + " Risk"}
            </div>

            <div className="basis-1/2 rounded-full bg-white/5 px-4 py-3 text-center  text-white/60">Spot</div>
          </div>

          <div className="rounded-3xl bg-white/5 px-4 py-6 text-sm font-medium">
            <div className="mb-4 flex justify-between">
              <p className="text-white">Expected Yield (APY)</p>
              <PriceChange valueToFixed={false} value={Number(fp.data?.profile.expected_yield.replace("%", ""))} />
            </div>

            <div className="flex justify-between">
              <p className="text-white">Expected Max Drawdown</p>
              <PriceChange
                bg={false}
                colorize={false}
                valueToFixed={false}
                value={Number(fp.data?.profile.max_drawdown.replace("%", ""))}
              />
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 px-4 py-6 text-sm">
            <p className="mb-4 text-white/80">Investment</p>
            <div className="flex items-center justify-between">
              <p className="w-full text-left text-white">
                <span className="text-white/40">Min</span>
                <br />
                <span className="font-medium">
                  {fp.data?.min_deposit} <span className="text-white/80">BUSD</span>
                </span>
              </p>
              <div className="h-[20px] w-[1px] rotate-12 border-l border-white/20" />
              <p className="w-full text-right text-white">
                <span className="text-white/40">Max</span>
                <br />
                <span className="font-medium">
                  {fp.data?.max_deposit} <span className="text-white/80">BUSD</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ProductCatalogDetail;
