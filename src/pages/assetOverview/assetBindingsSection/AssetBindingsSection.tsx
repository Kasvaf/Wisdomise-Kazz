import { ComputedDatum, ResponsivePie } from "@nivo/pie";
import * as numerable from "numerable";
import { AssetBinding } from "pages/productsCatalog/types/investorAssetStructure";
import { useState } from "react";
import { CoinsIcons, coinsIcons } from "shared/components/CoinsIcons";
import { useInvestorAssetStructuresQuery } from "shared/services/services";
import { useIsMobile } from "utils/useIsMobile";
import { AssetBindingsSectionTable } from "./AssetBindingsSectionTable";

export const AssetBindingsSection = () => {
  const isMobile = useIsMobile();
  const ias = useInvestorAssetStructuresQuery();
  const [currentHoverCoin, setCurrentHoverCoin] = useState<AssetBinding | null>();

  const data = ias.data?.[0];

  const onMouseEnter = (e: ComputedDatum<any>) => {
    setCurrentHoverCoin(data?.asset_bindings.find((d) => d.name === e.id));
  };

  const pieData =
    data?.asset_bindings.map((a) => ({
      id: a.name,
      label: a.name,
      value: a.equity,
      color: Reflect.get(coinsIcons, a.name as unknown as keyof typeof coinsIcons).color,
    })) || [];

  return (
    <div className="col-span-2 row-span-2 flex justify-start rounded-3xl bg-white/5 p-6 mobile:order-last mobile:flex-col ">
      <div className="basis-7/12 mobile:basis-auto">
        <AssetBindingsSectionTable />
      </div>
      <div className="relative flex h-full shrink-0 grow-0 basis-5/12 justify-end p-4 mobile:mt-4 mobile:h-36 mobile:basis-auto mobile:p-0">
        <div className="absolute right-2/4 top-2/4 -translate-y-1/2 translate-x-1/2 text-white">
          {currentHoverCoin ? (
            <div className="grid w-fit grid-cols-[1fr_max-content] first:ml-0">
              <div className="flex items-center">
                <>
                  <CoinsIcons size={isMobile ? 15 : "small"} coins={[currentHoverCoin.name]} />
                </>
                <span className="ml-2 text-xs text-white">{currentHoverCoin.name}</span>
              </div>
              <p className="ml-4 text-sm font-medium text-white/90 mobile:ml-2">
                {numerable.format(currentHoverCoin.share / 100, "0,0.0 %")}
              </p>
              <p />
              <p className="text-right text-xxs text-white/60">
                {numerable.format(currentHoverCoin.equity, "0,0.00", {
                  rounding: "floor",
                })}{" "}
                BUSD
              </p>
            </div>
          ) : (
            <p className="text-center text-2xl font-bold mobile:text-lg">
              {data?.asset_bindings.length} <br />
              Coins
            </p>
          )}
        </div>
        <ResponsivePie
          data={pieData}
          innerRadius={0.9}
          padAngle={3}
          cornerRadius={3}
          activeInnerRadiusOffset={6}
          colors={(d) => d.data.color}
          enableArcLinkLabels={false}
          arcLinkLabelsSkipAngle={10}
          enableArcLabels={false}
          arcLabelsSkipAngle={13}
          legends={[]}
          tooltip={() => <></>}
          onMouseEnter={onMouseEnter}
          // onMouseLeave={() => setCurrentHoverCoin(null)}
        />
      </div>
    </div>
  );
};
