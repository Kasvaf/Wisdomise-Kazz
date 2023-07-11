import { Area, AreaConfig } from "@ant-design/plots";
import React, { useMemo } from "react";

interface Props {
  data: AreaConfig["data"];
}

export const PriceAreaChart: React.FC<Props> = ({ data }) => {
  const configs = useMemo(() => {
    const trend = data.at(-1)?.y - data.at(0)?.y > 0 ? "up" : "down";
    const min = Math.min(...data.map((r) => r.y));
    const max = Math.max(...data.map((r) => r.y));

    return {
      data,
      renderer: "svg",
      tooltip: false,
      xField: "x",
      yField: "y",
      color: trend === "down" ? "#FF3939" : "#00DA98",
      smooth: true,
      height: 30,
      width: 100,

      xAxis: {
        range: [0, 1],
        label: null,
        line: null,
      },
      yAxis: {
        min,
        label: null,
        tickLine: null,
        grid: null,
        line: null,
        range: [0, 1],
      },
      line: {
        size: 0.8,
      },
      areaStyle: () => {
        return {
          fill:
            trend === "down"
              ? "l(270) 0:#1f242db2 1:#DF5F4D"
              : "l(270) 0:#1f242db2 1:#4FBF674D",
        };
      },
    } as AreaConfig;
  }, [data]);

  return <Area {...configs} />;
};
