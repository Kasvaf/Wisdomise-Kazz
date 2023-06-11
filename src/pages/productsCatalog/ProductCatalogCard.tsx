import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "shared/components/Button";
import { CoinsIcons } from "shared/components/Coins";
import { useInvestorAssetStructuresQuery } from "shared/services";
import { FPActivateButton } from "./FPActivateButton";
import { FinancialProduct } from "./types/financialProduct";
import { isFPRunning } from "./utils";

interface RiskCardProps {
  className?: string;
  fp: FinancialProduct;
}

export const ProductCatalogCard: FunctionComponent<RiskCardProps> = ({
  fp,
  className,
}) => {
  const navigate = useNavigate();
  const ias = useInvestorAssetStructuresQuery();

  const rrr = fp.profile.return_risk_ratio;
  const isRunning = isFPRunning(ias.data, fp.key);

  return (
    <div
      className={`flex flex-col rounded-3xl bg-white/5 ${className} ${
        isRunning && "!bg-white/10"
      }`}
    >
      <div className="flex flex-col p-6">
        <h5 className="mb-4 text-xl font-semibold text-white">{fp.title}</h5>
        <div className="mb-9 flex items-center justify-between">
          <div className="flex flex-col items-start gap-2 text-base font-medium">
            <div
              className={`rounded-full px-5 py-2 text-white/80 ${
                rrr === "High"
                  ? "bg-[#F1AA404D]"
                  : rrr === "Medium"
                  ? "bg-[#74ABFF33]"
                  : "bg-[#40F19C4D]"
              }`}
            >
              {rrr + " Risk"}
            </div>
            <div className="rounded-full bg-[#FFFFFF1A] px-5 py-2 text-white/80">
              Spot
            </div>
          </div>
          <CoinsIcons maxShow={3} coins={fp.config.assets} />
        </div>

        <section className="text-sm font-medium">
          <div className="mb-4 flex justify-between ">
            <p className=" text-white">Expected Yield (APY)</p>
            <p className="text-[#40F19C]">{fp.profile.expected_yield}</p>
          </div>

          <div className="mb-9 flex justify-between">
            <p className="font-medium text-white">Expected Max Drawdown</p>
            <p className="text-white">{fp.profile.max_drawdown}</p>
          </div>
        </section>

        <div className="mb-7 flex flex-col rounded-2xl bg-[#131822] p-4 text-sm">
          <p className="mb-4 text-white/80">Investment</p>
          <div className="flex items-center justify-between">
            <p className="w-full text-left text-white">
              <span className="font-medium">
                {fp.min_deposit} <span className="text-white/80">BUSD</span>
              </span>
              <br />
              <span className="text-white/40">Min</span>
            </p>
            <div className="h-[30px] w-[1px] rotate-12 border-l border-white/20" />
            <p className="w-full text-right text-white">
              <span className="font-medium">
                {fp.max_deposit} <span className="text-white/80">BUSD</span>
              </span>
              <br />
              <span className="text-white/40">Max</span>
            </p>
          </div>
        </div>

        <>
          <div className="between mb-2 flex gap-3">
            <FPActivateButton financialProduct={fp} className="basis-1/2" />
            <Button
              className="basis-1/2"
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
