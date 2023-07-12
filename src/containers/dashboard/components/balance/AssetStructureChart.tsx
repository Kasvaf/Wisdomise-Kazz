import { Pie } from "@ant-design/plots";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { floatData } from "utils/utils";
import { InvestorAssetStructures } from "../../../../pages/productsCatalog/types/investorAssetStructure";

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

const AssetStructureChart = (props: { investorAsset: InvestorAssetStructures }) => {
  const ias = props.investorAsset?.[0];

  const [symbol, setSymbol] = useState<any>([]);

  const convertData = () => {
    setSymbol([]);
    const symbolArray: any = [];
    props.investorAsset[0]?.asset_bindings.map((item) => {
      symbolArray.push({
        symbol: {
          key: item.name,
          name: item.name,
        },
        name: item.name,
        type: item.asset.type,
        amount: item.amount,
        equity: item?.equity,
        value: Number(floatData(item?.equity)),
        percent: ias?.total_equity ? (item?.equity / ias?.total_equity) * 100 : 0,
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
        content: `${floatData(props.investorAsset?.[0]?.total_equity)}`,
      },
    },
  };

  const columns = [
    {
      title: "Asset",
      dataIndex: "name",
      key: "type",
      legend: true,
      render: (text: any, data: any, index: any) => {
        return (
          <div className="flex items-center justify-start">
            <div style={{ backgroundColor: COLORS[index] }} className="h-3 w-3 rounded-full"></div>
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
            {floatData(text)}%
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
      render: (text: string) => {
        return (
          <p className="text-left text-base" title={`$${text}`}>
            ${Number(floatData(text))}
          </p>
        );
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
