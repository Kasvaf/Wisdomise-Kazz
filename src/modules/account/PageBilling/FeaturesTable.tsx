import { useMemo } from 'react';
import type { ColumnType } from 'antd/es/table';
import { Table } from 'antd';
import { ReactComponent as Check } from './images/check2.svg';
import vipBg from './images/vip-bg.png';

export function FeaturesTable() {
  const datasource = [
    { feature: 'Whale Radar', free: <Check />, vip: <Check /> },
    { feature: 'Radar +', free: <Check />, vip: <Check /> },
    {
      feature: 'Technical Radar',
      free: <div className="ml-3">-</div>,
      vip: <Check />,
    },
    {
      feature: 'Social Radar',
      free: <div className="ml-3">-</div>,
      vip: <Check />,
    },
    {
      feature: 'Alert Screener',
      free: <div className="ml-3">-</div>,
      vip: <Check />,
    },
    {
      feature: 'Trade Fee (%)',
      free: <div className="ml-2">0.8</div>,
      vip: <div className="ml-2">0.6</div>,
    },
  ] as const;

  const columns = useMemo<Array<ColumnType<any>>>(
    () => [
      {
        title: (
          <div className="text-2xl font-medium text-v1-content-primary mobile:text-xl">
            Experience
          </div>
        ),
        dataIndex: 'feature',
        render: (_, { feature }) => feature,
      },
      {
        title: (
          <div className="text-2xl font-medium text-v1-content-primary mobile:text-xl">
            Free
          </div>
        ),
        dataIndex: 'free',
        render: (_, { free }) => free,
      },
      {
        title: (
          <div className="relative bg-pro-gradient bg-clip-text text-2xl font-medium text-transparent mobile:text-xl">
            VIP
          </div>
        ),
        dataIndex: 'vip',
        render: (_, { vip }) => vip,
      },
    ],
    [],
  );

  return (
    <div className="relative w-full max-w-[40rem] overflow-hidden">
      <h2 className="mb-2 text-3xl mobile:text-xl">Compare Tires & Features</h2>
      <hr className="mb-12 border-v1-border-primary mobile:mb-6" />
      <Table
        className="[&_ant-table-thead]:!font-semibold [&_ant-table-thead]:text-v1-content-primary"
        rowClassName="!border-b !border-yellow-500"
        columns={columns}
        dataSource={datasource}
        pagination={false}
      />
      <img
        src={vipBg}
        className="absolute right-0 top-20 w-56 mobile:-right-16"
        alt=""
      />
    </div>
  );
}
