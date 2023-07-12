import { FunctionComponent, useMemo } from "react";

import Spinner from "components/spinner";
import { floatData } from "utils/utils";
// import { useGetExchangeAccountHistoricalStatisticQuery } from 'api/horosApi';
import { Line } from "@ant-design/plots";

interface HistoricalChartProps {
  historicalStatistic: any;
}

const HistoricalChartLine: FunctionComponent<HistoricalChartProps> = ({ historicalStatistic }) => {
  // const historicalStatistic =
  //   useGetExchangeAccountHistoricalStatisticQuery(exchangeAccountKey);

  const convertRowDataToLineChartData = useMemo(() => {
    const chartDataArray: any[] = [];
    if (historicalStatistic.data && historicalStatistic?.data.length > 0) {
      historicalStatistic?.data.map((item: any) => {
        chartDataArray.push({
          date: item.related_at.split("T")[0],
          value: Number(floatData(item.total_pnl)),
          name: "Total PNL",
        });
      });
    }

    return chartDataArray;
  }, [historicalStatistic]);

  const config: any = {
    data: convertRowDataToLineChartData,
    padding: "auto",
    xField: "date",
    yField: "value",

    xAxis: {
      nice: true,
      line: { style: { stroke: "#212327" } },
    },
    yAxis: {
      nice: true,
      line: { style: { stroke: "rgba(255, 255, 255, 0.1)" } },
      grid: { line: { style: { stroke: "rgba(255, 255, 255, 0.1)" } } },
    },

    point: {
      size: 2,
      shape: "circle",
      style: {
        fill: "white",
        stroke: "#5B8FF9",
        lineWidth: 2,
      },
    },
    smooth: true,
  };

  if (historicalStatistic.isLoading)
    return (
      <div className="flex w-full justify-center py-20">
        <Spinner />
      </div>
    );
  return (
    <div className="flex flex-col">
      <Line {...config} />
    </div>
  );
};

export default HistoricalChartLine;
