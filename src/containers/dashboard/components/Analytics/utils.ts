import { G2, LineConfig } from "@ant-design/plots";
import { deepMix } from "@antv/util";
import { DatePnl, PointData, PostSimulatePortfolioData, WealthData } from "api/backtest-types";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";
import minBy from "lodash/minBy";
import sortBy from "lodash/sortBy";
import numeral from "numeral";
import { useMemo } from "react";

export const useProvideAatChartDataConfig = (
  aatData: WealthData[] | undefined,
  coinData: PointData[] | undefined,
  options: {
    coin: string;
    is_daily_basis: boolean;
  }
): LineConfig => {
  const { coin } = options;
  return useMemo<LineConfig>(() => {
    if (aatData && coinData && !isEmpty(aatData) && !isEmpty(coinData)) {
      const sortedAATData = sortBy(
        aatData.map((d) => processAatData(d, "Wisdomise (AAT)")),
        "date"
      );

      const sortedCoinData = sortBy(
        coinData.map((d) => processCoinData(d, `${coin} HOLD`)),
        "date"
      ).filter((item) => sortedAATData.find((_item) => _item.timestamp === item.timestamp));

      const coinBasePrice = +Number(sortedCoinData[0].point);
      const addValueCoinData = sortedCoinData.map((d) => ({
        ...d,
        value: +Number((d.point * 100) / coinBasePrice - 100).toFixed(2),
      }));

      return updateAatChartConfig([...sortedAATData, ...addValueCoinData]);
    }

    return updateAatChartConfig([]);
    // no need for is_daily_basis
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coin, aatData, coinData]);
};

const processAatData = (data: WealthData, category: string) => ({
  ...data,
  category,
  value: +Number(data.wealth / 10 - 100).toFixed(2),
  timestamp: dayjs(data.date).format("YYYY-MM-DD HH"),
});

const processCoinData = (data: PointData, category: string) => ({
  ...data,
  category,
  timestamp: dayjs(data.date).format("YYYY-MM-DD HH"),
  date: new Date(data.date).getTime(),
});

const updateAatChartConfig = (data: Array<{ value: number }>): LineConfig => ({
  data,
  xField: "timestamp",
  yField: "value",
  width: 1280,
  seriesField: "category",
  color: ["#00FAAC", "#FF449F"],
  xAxis: {
    tickCount: 8,
    label: {
      style: {
        fill: "rgba(255,255,255, 0.6)",
      },
      formatter: (v) => v.split(" ")[0],
    },
  },
  yAxis: {
    label: {
      style: {
        fill: "rgba(255,255,255, 0.6)",
      },
      formatter: (v) => (v === "0" ? "0%" : `${numeral(v).format("0.0")}%`),
    },
    // minLimit: data.length ? minBy(data, 'value')!.value : 0,
  },
  theme: deepMix({}, G2.getTheme("dark"), {
    background: "#051D32",
  }),
  tooltip: {
    title: (v) => dayjs(v, "YYYY-MM-DD HH").format("YYYY-MM-DD HH:mm"),
    formatter: (datum) => ({ name: datum.category, value: `${datum.value}%` }),
    domStyles: {
      "g2-tooltip": {
        backgroundColor: "#03101C",
        color: "#fff",
      },
    },
  },
});

export const useProvideSpoChartDataConfig = (spoData: PostSimulatePortfolioData | undefined): LineConfig => {
  return useMemo<LineConfig>(() => {
    if (spoData && !isEmpty(spoData)) {
      return updateSpoChartConfig([
        ...sortBy(
          spoData.po_pnls.map((d) => processSpoData(d, "Horos (SPO)")),
          "timestamp"
        ),
        ...sortBy(
          spoData.benchmark_pnls.map((d) => processSpoData(d, "Benchmark")),
          "timestamp"
        ),
      ]);
    }

    return updateSpoChartConfig([]);
  }, [spoData]);
};

const updateSpoChartConfig = (data: Array<{ value: number }>): LineConfig => ({
  data,
  xField: "timestamp",
  yField: "value",
  width: 1280,
  seriesField: "category",
  color: ["#00FAAC", "#FF449F"],
  theme: deepMix({}, G2.getTheme("dark"), {
    background: "#051D32",
  }),
  yAxis: {
    label: {
      formatter: (v) => `${numeral(v).format("0")}%`,
    },
    minLimit: data.length ? minBy(data, "value")?.value || 0 : 0,
  },
  tooltip: {
    formatter: (datum) => ({ name: datum.category, value: `${datum.value}%` }),
    domStyles: {
      "g2-tooltip": {
        backgroundColor: "#03101C",
        color: "#fff",
      },
    },
  },
});

const processSpoData = (data: DatePnl, category: string) => ({
  ...data,
  category,
  value: Math.round(data.point),
  timestamp: data.date,
});
