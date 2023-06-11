import { ColumnType } from "antd/lib/table";
import { PositionType, Signal } from "api/types/signal";
import { DATE_FORMAT_ALT, TIME_FORMAT } from "containers/dashboard/constants";
import {
  coinRenderer,
  titleWTooltipRenderer,
} from "containers/dashboard/utils";
import dayjs from "dayjs";

import { ReactComponent as ClockActiveIcon } from "@images/icons/clock-active.svg";
import { ReactComponent as ClockIcon } from "@images/icons/clock.svg";
import { Tooltip } from "antd";
import { MutableRefObject, useEffect, useState } from "react";
import Intensity from "./components/Intensity";
import Position from "./components/Position";

const trim = (id: string) => {
  return id.substring(0, 4) + "..." + id.substring(id.length - 4, id.length);
};

export function useOnScreen<T extends Element>(
  ref: MutableRefObject<T>,
  rootMargin = "0px"
): boolean {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState<boolean>(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin,
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      observer.unobserve(ref.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return isIntersecting;
}

const checkNovelty = (timestamps: number[], timestamp: number) => {
  if (timestamps.length < 2) return false;
  const pastTime = timestamps[timestamps.length - 2];
  const currentTime = timestamp * 1000;
  return pastTime < currentTime;
};

export const getSignalColumns = (
  timestamps: number[],
  isDesktop?: boolean
): ColumnType<Signal>[] => [
  {
    title: <div className="pl-4">Time</div>,
    dataIndex: "created_at",
    key: "created_at",
    render: (_: unknown, { created_at }: { created_at: number }) => {
      const date = dayjs(new Date(created_at).getTime() as number);
      return (
        <div className="flex flex-row items-center justify-start space-x-2">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              checkNovelty(timestamps, created_at)
                ? "bg-primary"
                : "bg-transparent"
            }`}
          ></div>
          <div className="flex flex-col items-start justify-center">
            <div className="text-xs text-white">{date.format(TIME_FORMAT)}</div>
            <div className="text-[11px] text-white/50">
              {date.format(DATE_FORMAT_ALT)}
            </div>
          </div>
        </div>
      );
    },
    width: isDesktop ? "10rem" : undefined,
  },
  {
    title: "Pair",
    dataIndex: "symbol",
    key: "symbol",
    render: coinRenderer,
    // width: '8rem',
  },
  {
    title: titleWTooltipRenderer(
      <span>Side</span>,
      <>
        Shows the side of the signal either Long or Short, along with its
        strength. Signal strength is calculated by Wisdomise AI, based on
        real-time market monitoring
      </>
    ),
    dataIndex: "action",
    key: "action",
    render: (_: unknown, { intensity, side }) => (
      <div className="flex flex-row items-center space-x-2">
        <Intensity intensity={intensity} />
        <span
          className={`capitalize ${
            side.toLowerCase() === "long"
              ? "text-primary"
              : side.toLowerCase() === "short"
              ? "text-error"
              : "text-white"
          }`}
        >
          {side.toUpperCase()}
        </span>
      </div>
    ),
    // width: '7rem',
  },
  {
    title: "Signal Price",
    dataIndex: "price",
    key: "price",
    render: (
      _: unknown,
      {
        enter_price,
        exit_price,
        status,
      }: { enter_price: number; exit_price: number; status: PositionType }
    ) =>
      status === "WEAK" || Number(enter_price || exit_price) === 0 ? (
        <span className="text-nodata">-</span>
      ) : (
        Number(enter_price || exit_price)
      ),
    // width: '8rem',
  },
  {
    title: titleWTooltipRenderer(
      <span>DSL</span>,
      <>
        Wisdomise Dynamic Stop Loss dynamically adjusts your stop loss level,
        based on the price trend, to deliver maximum returns
      </>
    ),
    dataIndex: "stop_loss",
    key: "stop_loss",
    render: (
      _: unknown,
      {
        first_stop_loss,
        updated_at,
        enter_price,
        status,
      }: {
        first_stop_loss: number;
        updated_at: number;
        enter_price: number;
        status: PositionType;
      }
    ) =>
      status !== "WEAK" ? (
        <div className="flex flex-row items-center justify-between space-x-2">
          <span>
            {/* TODO check this please see the cause */}
            {Number(first_stop_loss) === 0
              ? "-"
              : Number(first_stop_loss).toFixed(
                  enter_price.toString().split(".")[1]?.length
                )}
          </span>
          <Tooltip
            placement="top"
            title={`Updated on: ${dayjs(updated_at).format(
              "ddd, MMM D, YYYY h:mm A"
            )}`}
          >
            {checkNovelty(timestamps, updated_at) ? (
              <ClockActiveIcon />
            ) : (
              <ClockIcon />
            )}
          </Tooltip>
        </div>
      ) : (
        <span className="text-nodata">-</span>
      ),
    // width: '8rem',
  },
  {
    title: titleWTooltipRenderer(
      <span>Status</span>,
      <>
        Shows status of the signal which is either Open or Closed. PnL of both
        states are calculated based on the most recent candle close price
      </>
    ),
    dataIndex: "status",
    key: "status",
    render: (
      _: unknown,
      {
        status,
        profit_and_loss: positionDelta,
      }: { status: PositionType; profit_and_loss: number }
    ) =>
      status !== "WEAK" ? (
        <Position position={status} delta={positionDelta} />
      ) : (
        <span className="text-nodata">-</span>
      ),
    // width: '7rem',
  },
  {
    title: <>Signal ID</>,
    dataIndex: "key",
    key: "key",
    render: (_: unknown, { key }: { key: string | null }) =>
      !key ? (
        <span className="text-nodata">-</span>
      ) : (
        <Tooltip placement="top" overlay={<>{key}</>}>
          <span className="cursor-default">{trim(key)}</span>
        </Tooltip>
      ),
    // width: '7rem',
  },
];
