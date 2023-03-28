import { FunctionComponent, useMemo } from "react";
import { Line } from "@ant-design/plots";
import { floatData } from "utils/utils";
import Spinner from "components/spinner";

interface LineChartProps {
  className?: string;
  chartData: any;
  loading?: boolean;
  title?: string;
}

const LineChart: FunctionComponent<LineChartProps> = ({
  className,
  chartData,
  loading,
  title,
}) => {
  const convertRowDataToChartData = useMemo(() => {
    const chartDataArray: any[] = [];
    chartData?.etf_benchmark.map((item: any) => {
      chartDataArray.push({
        date: item.date.split("T")[0],
        value: floatData(
          ((item.wealth - chartData?.etf_benchmark[0].wealth) /
            chartData?.etf_benchmark[0].wealth) *
            100
        ),
        category: title,
      });
    });
    chartData?.btc_benchmark.map((item: any) => {
      chartDataArray.push({
        date: item.date.split("T")[0],
        value: floatData(
          ((item.close - chartData?.btc_benchmark[0].close) /
            chartData?.btc_benchmark[0].close) *
            100
        ),
        category: "BTC",
      });
    });

    chartData?.gold_benchmark.map((item: any) => {
      chartDataArray.push({
        date: item.date.split("T")[0],
        value: floatData(
          ((item.close - chartData?.gold_benchmark[0].close) /
            chartData?.gold_benchmark[0].close) *
            100
        ),
        category: "Gold",
      });
    });
    chartData?.sp500_benchmark.map((item: any) => {
      chartDataArray.push({
        date: item.date.split("T")[0],
        value: floatData(
          ((item.close - chartData?.sp500_benchmark[0].close) /
            chartData?.sp500_benchmark[0].close) *
            100
        ),
        category: "S&P 500",
      });
    });

    return chartDataArray;
  }, [chartData]);
  const config = {
    data: convertRowDataToChartData,
    xField: "date",
    yField: "value",
    seriesField: "category",
    xAxis: {
      type: "time",
      nice: true,
      line: { style: { stroke: "#212327" } },
    },
    yAxis: {
      label: {
        formatter: (v: any) =>
          `${v}%`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
      nice: true,
      line: { style: { stroke: "rgba(255, 255, 255, 0.1)" } },
      grid: { line: { style: { stroke: "rgba(255, 255, 255, 0.1)" } } },
      minLimit: -150,
      maxLimit: 150,
    },

    color: ["#13DEF2", "#E26CFF", "#DFB13B", "#7a7a7a"],
  };
  if (loading)
    return (
      <div className="flex w-full justify-center py-20">
        <Spinner />
      </div>
    );
  return (
    <>
      <Line {...config} className={className} />
    </>
  );
};

export default LineChart;
