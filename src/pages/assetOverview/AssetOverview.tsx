import clsx from "clsx";
import * as numerable from "numerable";
import React from "react";
import { PageWrapper } from "shared/components/PageWrapper";
import { useInvestorAssetStructuresQuery } from "shared/services/services";
import { ActiveFinancialProducts } from "./activeFPs/ActiveFinancialProducts";
import { AssetBindingsSection } from "./assetBindingsSection/AssetBindingsSection";
import { ReactComponent as AvailableIcon } from "./icons/available.svg";
import { ReactComponent as BalanceIcon } from "./icons/balanceIcon.svg";
import { ReactComponent as DepositIcon } from "./icons/deposit.svg";
import { ReactComponent as PNLIcon } from "./icons/pnl.svg";
import { ReactComponent as WorkingCapitalIcon } from "./icons/workingCapital.svg";

const AssetOverview = () => {
  const ias = useInvestorAssetStructuresQuery();

  const data = ias.data?.[0];

  return (
    <PageWrapper loading={ias.isLoading}>
      <h1 className="mb-6 text-xl font-semibold text-white">Your Account Portfolio</h1>

      <p className="mb-8 mt-6 hidden text-xs text-white/60 mobile:block">
        AI-based trading strategies run automatically on your crypto wallet. These are built with our comprehensive and
        sophisticated AI after running over 300 million unique experiments
      </p>
      <div className="grid grid-cols-3 gap-6 mobile:flex mobile:flex-col mobile:gap-0">
        <InfoCard icon={BalanceIcon} title="Balance" value={data?.total_equity || 0} className="mobile:mb-4" />

        <InfoCard
          icon={() => (
            <PNLIcon
              className={clsx(
                data?.pnl !== undefined ? (data?.pnl >= 0 ? "text-[#40F19C]" : "text-white/80") : "text-[#40F19C]"
              )}
            />
          )}
          format="0,0.00"
          title="P / L"
          colorizeValue
          className="mobile:mb-4"
          value={data?.pnl || 0}
        />
        <InfoCard
          diffMobileView
          title="Deposit"
          subtitle="Amount"
          icon={DepositIcon}
          value={data?.net_deposit || 0}
          className="mobile:rounded-bl-none mobile:rounded-br-none mobile:!border-t-0"
        />

        <AssetBindingsSection />

        <InfoCard
          diffMobileView
          title="Working Capital"
          subtitle="AUM"
          icon={WorkingCapitalIcon}
          value={data?.working_capital || 0}
          className="mobile:rounded-none"
        />

        <InfoCard
          diffMobileView
          title="Available"
          icon={AvailableIcon}
          subtitle="Withdrawable"
          value={data?.main_exchange_account.quote_equity || 0}
          className="mobile:mb-4 mobile:rounded-tl-none mobile:rounded-tr-none"
        />
      </div>

      <h1 className="mb-6 mt-6 text-xl font-semibold text-white">Your Account Portfolio</h1>

      <ActiveFinancialProducts />
    </PageWrapper>
  );
};

const InfoCard: React.FC<{
  title: string;
  value: number;
  icon: React.FC;
  format?: string;
  subtitle?: string;
  className?: string;
  diffMobileView?: boolean;
  colorizeValue?: boolean;
}> = ({ title, value, format, subtitle, icon: Icon, colorizeValue = false, className, diffMobileView }) => {
  return (
    <div
      className={clsx(
        "rounded-3xl bg-white/5 p-6",
        className,
        diffMobileView && "mobile:flex mobile:flex-row-reverse mobile:border-t mobile:border-white/5"
      )}
    >
      <div className="mb-2 flex justify-end mobile:mb-0">
        <Icon />
      </div>
      <div className={clsx(diffMobileView && "mobile:flex-grow")}>
        <p className="text-sm leading-none text-white/60">
          {title} <span className="text-xxs text-white/40">{subtitle}</span>
        </p>

        <p
          className={clsx(
            "mt-4 text-xl font-semibold leading-none text-white",
            colorizeValue && value >= 0 && "!text-[#40F19C]",
            title === "Balance" && "!text-2xl"
          )}
        >
          {numerable.format(value, format || "0,0.00", {
            rounding: "floor",
          })}
          <span className="ml-1 text-xs text-white/40">BUSD</span>
        </p>
      </div>
    </div>
  );
};

export default AssetOverview;
