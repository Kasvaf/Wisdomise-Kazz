import { Tooltip } from "antd";
import _ from "lodash";
import { ReactNode } from "react";
import { coins } from "./constants";

import { ReactComponent as InfoIcon } from "@images/info.svg";
import { IFilter } from "./common/Filters/types";

export const renderSide = (side: string): JSX.Element => (
  <div className={`side ${side} inline-block w-fit px-4 py-3 leading-none`}>
    {side.replace(/^\w/, (c) => c.toUpperCase())}
  </div>
);

export const titleWTooltipRenderer = (
  title: ReactNode,
  tooltip: ReactNode,
  alignRight?: boolean
): JSX.Element => (
  <div
    className={`flex flex-row items-center space-x-2 ${
      alignRight ? "justify-end" : ""
    }`}
  >
    <span>{title}</span>
    <Tooltip placement="bottom" title={tooltip}>
      <InfoIcon className="fill-nodata" />
    </Tooltip>
  </div>
);

export const checkAllFiltersFilled = (filters: IFilter) => {
  return Object.keys(filters).reduce((_prev, next) => {
    const filter = filters[next];
    if (_.isEmpty(filter)) {
      return true;
    } else if (Object.keys(filter).some((key) => !!filter[key])) {
      return _prev || false;
    }
    return true;
  }, false);
};

export const displayActiveTab = (
  tab: { id: string },
  selectedTab: { id: string },
  firstTime?: boolean
) => (selectedTab.id !== tab.id || firstTime ? "none" : "");

export const coinRenderer = (
  _: unknown,
  dataInput: { pair: string }
): JSX.Element => {
  const symbol = dataInput.pair;
  const parsedSymbol =
    symbol.indexOf("USDT") !== -1 ? symbol.split("USDT")[0] : symbol;

  const { icon, name } = coins[parsedSymbol as keyof typeof coins] || {};
  return (
    <div className="flex flex-row items-center">
      <img src={icon} alt={name} className="mr-2 w-5" />
      <span>{symbol}</span>
    </div>
  );
};

export const getNumberWithSign = (num: number) =>
  `${num >= 0 ? "+" : "-"}${num?.toFixed(2)}`;
