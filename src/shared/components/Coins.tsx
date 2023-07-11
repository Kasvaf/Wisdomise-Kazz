import ADA from "@images/coins/ada.svg";
import BNB from "@images/coins/bnb.svg";
import BTC from "@images/coins/btc.svg";
import BUSD from "@images/coins/busd.svg";
import DOGE from "@images/coins/doge.svg";
import ETH from "@images/coins/eth.svg";
import LTC from "@images/coins/ltc.svg";
import TRX from "@images/coins/trx.svg";
import USDT from "@images/coins/usdt.svg";
import XRP from "@images/coins/xrp.svg";
import { Avatar } from "antd";
import React, { useMemo } from "react";

interface Props {
  maxShow?: number;
  coins: string[] | string;
}

export const CoinsIcons: React.FC<Props> = ({ coins, maxShow }) => {
  const [_coins, isMaxShowEnable] = useMemo(() => {
    const coinsArray = Array.isArray(coins)
      ? coins
      : coins.split("#").map((c) => c.split("_")[1]?.toUpperCase());

    return [
      Array.from(new Set(coinsArray.filter((c) => c in coinsIcons))).filter(
        (_, i) => i < (maxShow || Number.POSITIVE_INFINITY)
      ),
      coinsArray.length > (maxShow || Number.POSITIVE_INFINITY),
    ];
  }, [coins, maxShow]);

  return (
    <Avatar.Group>
      {_coins.map((c) => (
        <Avatar
          size="default"
          className="!border-0"
          key={coinsIcons[c as keyof typeof coinsIcons].name}
          src={coinsIcons[c as keyof typeof coinsIcons].src}
        />
      ))}
      {isMaxShowEnable && (
        <p
          className="ml-2 ms-2 flex items-center text-white"
          style={{ marginInlineStart: "0.5rem" }}
        >
          . . .
        </p>
      )}
    </Avatar.Group>
  );
};

export const coinsIcons = {
  ADA: {
    name: "ADA",
    src: ADA,
  },
  BNB: {
    name: "BNB",
    src: BNB,
  },
  BTC: {
    name: "BTC",
    src: BTC,
  },
  DOGE: {
    name: "DOGE",
    src: DOGE,
  },
  ETH: {
    name: "ETH",
    src: ETH,
  },
  LTC: {
    name: "LTC",
    src: LTC,
  },
  TRX: {
    name: "TRON",
    src: TRX,
  },
  XRP: {
    name: "XRP",
    src: XRP,
  },
  USDT: {
    name: "USDT",
    src: USDT,
  },
  BUSD: {
    name: "BUSD",
    src: BUSD,
  },
} as const;
