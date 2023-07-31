import clsx from "clsx";
import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "shared/components/Button";
import { CoinsIcons } from "shared/components/CoinsIcons";
import { PriceChange } from "shared/components/priceChange/PriceChange";
import { useInvestorAssetStructuresQuery } from "shared/services/services";
import { FPActivateButton } from "./FPActivateButton";
import { FinancialProduct } from "./types/financialProduct";
import { isFPRunning } from "./utils";

interface RiskCardProps {
  className?: string;
  fp: FinancialProduct;
}

export const ProductCatalogCard: FunctionComponent<RiskCardProps> = ({ fp, className }) => {
  const navigate = useNavigate();
  const ias = useInvestorAssetStructuresQuery();

  const rrr = fp.profile.return_risk_ratio;
  const isRunning = isFPRunning(ias.data, fp.key);

  return (
    <div className={clsx("flex flex-col rounded-3xl bg-white/5", className, isRunning && "!bg-white/10")}>
      <div className="flex flex-grow flex-col p-6">
        <h5 className="mb-4 flex-grow text-base font-semibold text-white">{fp.title}</h5>
        <div className="mb-9 flex items-center justify-between">
          <div className="flex items-start gap-2 text-xs font-normal">
            <div className="rounded-full bg-white/5 px-5 py-2 text-white/60">{fp.config.market_type}</div>
            <div
              className={`rounded-full px-3 py-2 ${
                rrr === "High"
                  ? "bg-[#F1AA4033] text-[#F1AA40]"
                  : rrr === "Medium"
                  ? "bg-[#74ABFF33] text-[#34A3DA]"
                  : "bg-[#40F19C33] text-[#40F19C]"
              }`}
            >
              {rrr + " Risk"}
            </div>
          </div>
          <CoinsIcons maxShow={3} coins={fp.config.assets} />
        </div>

        <section className="text-sm font-medium">
          <div className="mb-4 flex justify-between ">
            <p className=" text-white">Expected Yield (APY)</p>
            <PriceChange valueToFixed={false} value={Number(fp.profile.expected_yield.replace("%", ""))} />
          </div>

          <div className="mb-9 flex justify-between">
            <p className="font-medium text-white">Expected Max Drawdown</p>
            <PriceChange
              bg={false}
              colorize={false}
              valueToFixed={false}
              value={Number(fp.profile.max_drawdown.replace("%", ""))}
            />
          </div>
        </section>

        <div className="-mx-6 mb-7 flex flex-col bg-black/20 p-4 text-xs">
          <p className="mb-4 text-white/80">Investment</p>
          <div className="flex items-center justify-between">
            <p className="w-full text-left text-white">
              <span className="text-white/40">Min</span>
              <br />
              <span className="font-medium">
                {fp.min_deposit} <span className="text-white/80">BUSD</span>
              </span>
            </p>
            <div className="h-[20px] w-[1px] rotate-12 border-l border-white/20" />
            <p className="w-full text-right text-white">
              <span className="text-white/40">Max</span>
              <br />
              <span className="font-medium">
                {fp.max_deposit} <span className="text-white/80">BUSD</span>
              </span>
            </p>
          </div>
        </div>

        <>
          <div className="between mb-2 flex gap-3">
            <FPActivateButton financialProduct={fp} className="basis-2/3" />
            <Button
              className="basis-1/3"
              variant="secondary"
              onClick={() => navigate(`/app/products-catalog/${fp.key}`)}
            >
              Detail
            </Button>
          </div>
        </>
      </div>
    </div>
  );
};
