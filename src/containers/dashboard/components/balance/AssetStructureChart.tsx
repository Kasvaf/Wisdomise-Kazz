import { floatData } from "utils/utils";
import { useEffect, useState } from "react";
import { Pie } from "@ant-design/plots";
import { Table } from "antd";

const COLORS = [
  "#FF6B3B",
  "#247FEA",
  "#F383A2",
  "#FFC100",
  "#9FB40F",
  "#76523B",
  "#DAD5B5",
  "#0E8E89",
  "#E19348",
  "#626681",
];

enum ASSET_TYPE {
  SYMBOL = "SYMBOL",
  PAIR = "PAIR",
}

const AssetStructureChart = (props: any) => {
  const exchange_account =
    props.investorAsset?.data &&
    props.investorAsset?.data?.results?.length > 0 &&
    props.investorAsset?.data?.results[0]?.trader_instances.length > 0 &&
    props.investorAsset?.data?.results[0]?.trader_instances[0]
      ?.exchange_account;

  const [symbol, setSymbol] = useState<any>([]);

  const convertData = () => {
    setSymbol([]);
    const symbolArray: any = [];
    exchange_account.asset_bindings.map((item: any) => {
      symbolArray.push({
        symbol: {
          key: item?.key,
          name: item?.name,
        },
        type:
          item.asset.type === ASSET_TYPE.SYMBOL
            ? item.asset.symbol.name
            : item.asset.pair.name,
        amount: item.amount,
        equity: Number(floatData(item?.equity)),
        value: Number(floatData(item?.equity)),
        percent: item?.equity / exchange_account.total_equity,
      });
    });

    setSymbol([...symbol, ...symbolArray]);
  };

  useEffect(() => {
    convertData();
  }, []);

  const config: any = {
    appendPadding: 10,
    data: symbol,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.64,
    legend: false,
    label: {
      type: "inner",
      offset: "-50%",
      style: {
        textAlign: "center",
      },
      autoRotate: false,

      content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
    },

    theme: {
      colors10: [...COLORS],
    },

    statistic: {
      title: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          padding: 10,
          lineHeight: 2,
          color: "#aaa",
        },
        content: `Total`,
      },
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: "white",
        },
        content: `${floatData(exchange_account?.total_equity)}`,
      },
    },
  };

  const columns = [
    {
      title: "Asset",
      dataIndex: "type",
      key: "type",
      legend: true,
      render: (text: any, data: any, index: any) => {
        return (
          <div className="flex items-center justify-start">
            <div
              style={{ backgroundColor: COLORS[index] }}
              className="h-3 w-3 rounded-full"
            ></div>
            <p className="ml-2 text-base">{text}</p>
          </div>
        );
      },
    },
    {
      title: "Percent",
      dataIndex: "percent",
      key: "percent",
      render: (text: any) => {
        return (
          <p className="text-left text-base" title={`${text}%`}>
            {floatData(text * 100)}%
          </p>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text: any) => {
        return (
          <p className="text-left text-base" title={text}>
            {floatData(text)}
          </p>
        );
      },
    },

    {
      title: "Equity",
      dataIndex: "equity",
      key: "equity",
      render: (text: any) => {
        return <p className="text-left text-base">{floatData(text)} $</p>;
      },
    },
  ];

  const windowWidth = document.body.clientWidth;
  const pieWidth = Math.min(400, windowWidth - 60);

  return (
    <>
      {symbol?.length > 0 && (
        <div className="mt-[-20px] flex flex-col items-center justify-between sm:flex-row sm:items-start">
          <Table
            className="wis-table mt-10  !bg-transparent md:mb-0"
            dataSource={symbol}
            columns={columns}
            pagination={false}
          />
          <div className="mr-0 sm:mr-10">
            <Pie {...config} width={pieWidth} height={350} />
          </div>
        </div>
      )}
    </>
  );
};

// export default memo(
//   AssetStructureChart,
//   (preProps: any, nextProps: any) => true,
// );
export default AssetStructureChart;
