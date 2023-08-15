import { notification } from "antd";
import { AxiosError } from "axios";
import clsx from "clsx";
import dayjs from "dayjs";
import * as numerable from "numerable";
import { FinancialProductInstance } from "pages/productsCatalog/types/investorAssetStructure";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { CoinsIcons } from "shared/components/CoinsIcons";
import { useInvestorAssetStructuresQuery, useUpdateFPIStatusMutation } from "shared/services/services";
import { useIsMobile } from "utils/useIsMobile";
import { ReactComponent as ArrowUpIcon } from "../icons/arrowUp.svg";
import { ReactComponent as DeactivateIcon } from "../icons/deactivate.svg";
import { ReactComponent as PauseIcon } from "../icons/pause.svg";
import { ReactComponent as PlusIcon } from "../icons/plus.svg";
import { ReactComponent as StartIcon } from "../icons/start.svg";
import { PopConfirmChangeFPIStatus } from "./PopConfirmChangeFPIStatus";

export const ActiveFinancialProducts = () => {
  const isMobile = useIsMobile();
  const ias = useInvestorAssetStructuresQuery();
  const updateFPIStatus = useUpdateFPIStatusMutation();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const data = ias.data?.[0];

  const changeFpiStatus = async (fpiKey: string, status: "stop" | "start" | "pause" | "resume") => {
    try {
      await updateFPIStatus.mutateAsync({
        status,
        fpiKey: fpiKey,
      });
    } catch (error) {
      notification.error({
        message: (error as AxiosError<{ message: string }>).response?.data.message || "",
      });
    }
  };

  const statusBadge = (fpi: FinancialProductInstance) => (
    <div
      className={clsx(
        "mx-6 my-4 mr-0 flex flex-col items-center justify-center mobile:m-0",
        detailsOpen && "justify-between"
      )}
    >
      <p className={clsx("hidden text-sm text-white/80", detailsOpen && "!block", "mobile:!hidden")}>Status</p>
      <p
        className={clsx(
          "rounded-full bg-opacity-20 px-3 py-2 text-xxs leading-none first-letter:uppercase",
          fpi.status === "RUNNING" && "bg-[#40F19C] text-[#40F19C]",
          fpi.status === "PAUSED" && "bg-[#F1AA40] text-[#F1AA40]",
          fpi.status === "DRAFT" && "bg-white text-white"
        )}
      >
        {fpi.status.toLowerCase()}
      </p>
    </div>
  );

  const detailsBtn = (
    <button className="ml-3 flex items-center text-xs text-white/80" onClick={() => setDetailsOpen((v) => !v)}>
      Details <ArrowUpIcon className={clsx("ml-2 rotate-180 transition", detailsOpen && "rotate-[360deg]")} />
    </button>
  );

  return (
    <>
      {data?.financial_product_instances.map((fpi) => (
        <div key={fpi.key} className={clsx("mb-6 rounded-3xl bg-white/5 p-6", !detailsOpen && !isMobile && "pb-2")}>
          <header className="flex w-full items-start justify-start mobile:flex-col">
            <section className="flex w-full items-start mobile:justify-between">
              <p className="mr-4 text-base font-medium text-white/90 ">{fpi.financial_product.title}</p>
              <div className="flex items-center justify-center gap-x-2">
                <PopConfirmChangeFPIStatus type="stop" onConfirm={() => changeFpiStatus(fpi.key, "stop")}>
                  <DeactivateIcon className="cursor-pointer text-white/80" />
                </PopConfirmChangeFPIStatus>

                <PopConfirmChangeFPIStatus
                  type={fpi.status === "DRAFT" ? "start" : fpi.status === "RUNNING" ? "pause" : "resume"}
                  onConfirm={() =>
                    changeFpiStatus(
                      fpi.key,
                      fpi.status === "DRAFT" ? "start" : fpi.status === "RUNNING" ? "pause" : "resume"
                    )
                  }
                >
                  {fpi.status === "RUNNING" ? (
                    <PauseIcon className="cursor-pointer text-white/80" />
                  ) : (
                    <StartIcon className="cursor-pointer text-white/80" />
                  )}
                </PopConfirmChangeFPIStatus>
              </div>
            </section>

            <div className="ml-auto flex items-center self-start mobile:ml-0 mobile:mt-3 mobile:w-full ">
              {[fpi.financial_product.asset_class.toLowerCase(), "Spot"].map((e) => (
                <p
                  key={e}
                  className="mr-2 rounded-3xl bg-white/5 px-2 py-1 text-xxs leading-none text-white/20 first-letter:uppercase last:mr-0"
                >
                  {e}
                </p>
              ))}

              {!isMobile && detailsBtn}
              <section className="ml-auto hidden self-end mobile:block">{statusBadge(fpi)}</section>
            </div>
          </header>

          <main
            className={clsx(
              "mt-3 flex items-stretch justify-between mobile:flex-col",
              detailsOpen && "h-24 mobile:h-auto"
            )}
          >
            <div
              className={clsx(
                "mx-6 my-4 ml-0 flex items-center justify-between mobile:mr-0 mobile:flex-row",
                detailsOpen && "flex-col !items-start"
              )}
            >
              <p className="text-sm text-white/80">Equity</p>
              <p className={clsx("ml-20 text-base font-medium text-white", detailsOpen && "!ml-0")}>
                {numerable.format(fpi.total_equity, "0,0.00", {
                  rounding: "floor",
                })}
                <span className="ml-2 text-xs font-normal text-white/40">BUSD</span>
              </p>
            </div>

            <VerticalLine />

            {/* <VerticalLine />
            <div className="mx-6 my-4 flex flex-col justify-between">
              <div className="flex justify-between">
                <p className="mr-6 text-sm text-white/80">
                  Equity Chart{" "}
                  <span className="text-xxs text-white/40">7d</span>
                </p>
                <PriceChange value={11.9} />
              </div>
              <PriceAreaChart data={sdf} />
            </div> */}

            <div
              className={clsx(
                "mx-6 my-4 flex items-center justify-between mobile:mx-0 mobile:flex-row",
                detailsOpen && "flex-col !items-start"
              )}
            >
              <p className="mr-6 text-sm text-white/80">P / L</p>
              <p className="text-base font-semibold text-white">
                {numerable.format(fpi.pnl, "0,0.00", { rounding: "floor" })}
                <span className="ml-2 text-xs font-normal text-white/40">BUSD</span>
              </p>
            </div>

            {!isMobile && <VerticalLine />}

            <div
              className={clsx(
                "mx-6 my-4 flex flex-col justify-between mobile:order-first mobile:mx-0 mobile:mb-0",
                detailsOpen && "mobile:mb-4 mobile:flex-row"
              )}
            >
              <p className="text-xs font-medium text-white/40">
                {numerable.format(fpi.total_equity_share / 100, "0,0.0 %")} {isMobile && detailsOpen && <br />}
                <span className="text-xs text-white/40">Of Total Balance</span>
              </p>
              <p
                className={clsx(
                  "mt-4 text-xs text-white/40 mobile:mt-0 mobile:hidden",
                  detailsOpen && "mobile:order-first mobile:!block"
                )}
              >
                {fpi.status === "DRAFT" ? "Created" : "Started"}
                {isMobile ? <br /> : <>&nbsp;&nbsp;</>}
                {dayjs(fpi.status === "DRAFT" ? fpi.created_at : fpi.started_at).format("MMMM DD, YYYY")} &nbsp;&nbsp;
                <span className="text-xxs text-white/20">
                  {dayjs(fpi.status === "DRAFT" ? fpi.created_at : fpi.started_at).fromNow()}
                </span>
              </p>
            </div>

            {isMobile && detailsOpen && (
              <div className="order-first">
                <VerticalLine />
              </div>
            )}

            {!isMobile && (
              <>
                <VerticalLine />
                {statusBadge(fpi)}
              </>
            )}
          </main>

          {fpi.status !== "DRAFT" && detailsOpen && (
            <footer>
              {ias.data?.[0] && ias.data[0].asset_bindings.length > 0 && (
                <p className="mb-2 mt-4 text-sm text-white/80">AUM in {fpi.financial_product.title}</p>
              )}

              <section className="flex mobile:flex-col mobile:justify-between">
                {ias.data?.[0]?.asset_bindings.map((a) => (
                  <React.Fragment key={a.name}>
                    <div className="mx-6 mt-4 grid w-fit grid-cols-2 items-center first:ml-0 mobile:mx-0 mobile:flex mobile:w-full mobile:items-center mobile:justify-between mobile:rounded-lg mobile:bg-white/5 mobile:p-2">
                      <div className="flex items-center">
                        <CoinsIcons size={isMobile ? 15 : "small"} coins={[a.name]} />
                        <span className="ml-2 text-xs text-white">{a.name}</span>
                      </div>
                      <p className="ml-4 text-sm font-medium text-white/90 mobile:ml-0">
                        {numerable.format(a.share / 100, "0,0.00 %")}
                      </p>
                      <p className="mobile:hidden" />
                      <p className="text-right text-xxs text-white/60 mobile:text-xs">
                        {numerable.format(a.equity, "0,0.00", {
                          rounding: "floor",
                        })}{" "}
                        <span className="">BUSD</span>
                      </p>
                    </div>

                    <div className="mx-1 my-4 h-auto border-l border-white/10 last:hidden mobile:hidden" />
                  </React.Fragment>
                ))}
              </section>
            </footer>
          )}

          {isMobile && <section className="mt-6 flex justify-end">{detailsBtn}</section>}
        </div>
      ))}

      {data && data?.financial_product_instances.length === 0 && (
        <NavLink
          to="/app/products-catalog"
          className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-black/20 py-6"
        >
          <p className="flex items-center text-white/60">
            Add Strategy <PlusIcon className="ml-4 h-4 w-4" />
          </p>
          <p className="mt-6 w-1/2 text-center text-xs text-white/40">
            Maximize your profits with the help of AI-powered crypto trading bots that can automatically buy and sell
            cryptocurrencies based on advanced algorithms and patterns.
          </p>
        </NavLink>
      )}
    </>
  );
};

const VerticalLine = () => (
  <div className="mx-1 my-6 h-auto border-l border-white/10 mobile:my-0 mobile:w-full mobile:border-b" />
);
