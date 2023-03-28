import { FunctionComponent, useMemo } from "react";
import { floatData } from "utils/utils";
import Spinner from "components/spinner";
// import { useGetExchangeAccountHistoricalStatisticQuery } from 'api/horosApi';
import { Column } from "@ant-design/plots";

interface HistoricalChartProps {
  historicalStatistic: any;
}

const HistoricalChart: FunctionComponent<HistoricalChartProps> = ({
  historicalStatistic,
}) => {
  // const historicalStatistic =
  //   useGetExchangeAccountHistoricalStatisticQuery(exchangeAccountKey);

  const convertRowDataToColumnChartData = useMemo(() => {
    const chartDataArray: any[] = [];
    if (historicalStatistic.data && historicalStatistic?.data.length > 0) {
      historicalStatistic?.data.map((item: any, index: number) => {
        const prePnlValue =
          index === 0
            ? historicalStatistic.data[0].total_pnl
            : historicalStatistic.data[index - 1].total_pnl;
        chartDataArray.push({
          date: item.related_at.split("T")[0],
          originalValue: item.total_pnl,
          value: floatData(item.total_pnl - prePnlValue),
          category: "Total Pnl",
        });
      });
    }

    return chartDataArray;
  }, [historicalStatistic]);

  const negativeColor = "#FF3459";
  const positiveColor = "#78EFD9";

  const min = Math.min(...convertRowDataToColumnChartData.map((d) => d.value));
  const max = Math.max(...convertRowDataToColumnChartData.map((d) => d.value));
  const roundMin = Math.floor(min);
  const roundMax = Math.ceil(max);
  const maxDiff = Math.max(Math.abs(roundMin), Math.abs(roundMax));

  const columnConfig: any = {
    data: convertRowDataToColumnChartData,
    xField: "date",
    yField: "value",
    seriesField: "value",
    color: ({ value }: any) => {
      if (value < 0) {
        return negativeColor;
      }

      return positiveColor;
    },
    legend: false,
    tooltip: {
      customContent: (title: string, data: any) => {
        return (
          <div className="p-3">
            <p className="mb-3">Date: {title}</p>
            {data.length ? (
              <p style={{ color: data[0].color }}>
                {" "}
                value: {data[0].value} BUSD
              </p>
            ) : (
              <p>0</p>
            )}
          </div>
        );
      },
    },
    xAxis: {
      nice: true,
      line: { style: { stroke: "#212327" } },
    },
    yAxis: {
      tickCount: 5,
      title: {
        text: "BUSD",
      },
      nice: true,
      line: { style: { stroke: "rgba(255, 255, 255, 0.1)" } },
      grid: {
        line: { style: { stroke: "rgba(255, 255, 255, 0.1)" } },
      },
      minLimit: maxDiff * -1 - 1,
      maxLimit: maxDiff + 1,
    },
    columnStyle: {
      radius: 4,
    },
  };

  if (historicalStatistic.isLoading)
    return (
      <div className="flex w-full justify-center py-20">
        <Spinner />
      </div>
    );
  return (
    <div className="flex flex-col">
      <Column {...columnConfig} />
    </div>
  );
};

export default HistoricalChart;
