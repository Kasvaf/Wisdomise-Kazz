import { Skeleton } from "antd";
import { FunctionComponent } from "react";
import Button from "components/Button";
import { BUTTON_TYPE } from "utils/enums";
import { ReactComponent as TickIcon } from "@images/tick.svg";

export enum RISK_PACKAGE_ENUM {
  LOW = "low",
  MID = "mid",
  HIGH = "high",
}

interface RiskCardProps {
  id?: number;
  type?: RISK_PACKAGE_ENUM;
  title?: string;
  expectedYield: number;
  maxDrawdown: number;
  riskRatio: string;
  showHeader?: boolean;
  showActions?: boolean;
  onSubscribe?: () => void;
  onDetail?: () => void;
  onClickCard?: (key: number | undefined) => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  selected?: boolean;
  subscriptionLoading?: boolean;
  minDeposit?: number;
  maxDeposit?: number;
}

const RiskCard: FunctionComponent<RiskCardProps> = ({
  id,
  // type,
  title,
  expectedYield,
  maxDrawdown,
  riskRatio,
  onSubscribe,
  onDetail,
  onClickCard,
  showHeader,
  showActions,
  className,
  loading,
  disabled,
  selected,
  subscriptionLoading,
  minDeposit,
  maxDeposit,
}) => {
  const onClick = () => {
    if (typeof onClickCard === "function" && !loading) onClickCard(id);
  };

  const onClickSubscribe = () => {
    if (typeof onSubscribe === "function" && !loading) onSubscribe();
  };

  return (
    <div
      className={`flex w-full flex-col rounded bg-gray-dark ${className} ${
        selected &&
        "bg-gradient-to-r from-gradientFromTransparent to-gradientToTransparent "
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col p-6">
        {showHeader && (
          <>
            <h5 className="mb-4 text-xl text-white">{title}</h5>
            <div className="flex ">
              <div className="mb-[33px] self-baseline rounded bg-gray-main px-6 py-1 text-gray-light">
                SPOT
              </div>
            </div>
          </>
        )}
        <div className="mb-4 flex justify-between">
          <p className="text-gray-light">Expected Yield (APY)</p>
          {loading ? (
            <Skeleton.Button className="w-10" active size="small" />
          ) : (
            <p className="font-bold text-primary">{expectedYield}</p>
          )}
        </div>

        <div className="mb-4 flex justify-between">
          <p className="text-gray-light">Expected Max Drawdown</p>
          {loading ? (
            <Skeleton.Button className="w-10" active size="small" />
          ) : (
            <p className=" text-gray-light">{maxDrawdown}</p>
          )}
        </div>

        <div className="mb-[28px] flex justify-between">
          <p className="text-gray-light"> Expected Return/Risk Ratio</p>
          {loading ? (
            <Skeleton.Button className="w-10" active size="small" />
          ) : (
            <p className=" text-gray-light">{riskRatio}</p>
          )}
        </div>

        {showActions && (
          <div className="mb-7 flex flex-col rounded bg-[#00000080] px-3 py-2">
            <p className="mb-1 text-gray-light">Min/Max Investment</p>
            <div className="flex items-center justify-between">
              <p className="w-full text-left text-white"> {minDeposit} BUSD</p>
              <hr className="w-full border border-white" />
              <p className="w-full text-right text-white"> {maxDeposit} BUSD</p>
            </div>
          </div>
        )}

        {showActions && (
          <>
            <div className="mb-2 flex justify-between gap-3">
              {selected ? (
                <div
                  onClick={onClick}
                  className={`min-h-[48px] flex-1 rounded bg-gradient-to-r from-gradientFromTransparent to-gradientToTransparent p-[3px] `}
                >
                  <div className="flex h-full flex-col items-center  justify-between px-4 py-1 text-center text-sm font-bold uppercase text-gray-dark">
                    <div className="flex flex-row items-center 2xl:gap-4">
                      <TickIcon className="mx-1 w-4" />
                      <p className="text-white">CURRENT</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  type={BUTTON_TYPE.FILLED}
                  className="!w-full"
                  text={subscriptionLoading ? "Loading..." : "Activate"}
                  disabled={loading || disabled || subscriptionLoading}
                  onClick={onClickSubscribe}
                />
              )}
              <Button
                type={BUTTON_TYPE.OUTLINED}
                text="DETAILS"
                className="!w-full flex-1"
                disabled={loading || subscriptionLoading}
                onClick={onDetail}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RiskCard;
