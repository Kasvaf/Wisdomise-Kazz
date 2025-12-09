import { Table } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { clsx } from 'clsx';
import { useMemo } from 'react';
import { ReactComponent as Check } from './images/check2.svg';
import { ReactComponent as ProCheck } from './images/pro-check.svg';
import vipBg from './images/vip-bg.png';

export function FeaturesTable({ className }: { className?: string }) {
  const datasource = [
    {
      feature: 'Trade Fee (%)',
      free: <div className="text-xl">0.8</div>,
      vip: (
        <div className="bg-pro-gradient bg-clip-text font-medium text-transparent text-xl">
          0.6
        </div>
      ),
    },
    { feature: 'Whale Radar', free: <Check />, vip: <ProCheck /> },
    {
      feature: 'Bluechips',
      free: <Check />,
      vip: <ProCheck />,
    },
    {
      feature: 'Revenue Share *',
      free: <div className="ml-3">-</div>,
      vip: <ProCheck />,
    },
    {
      feature: 'Technical Radar',
      free: <div className="ml-3">-</div>,
      vip: <ProCheck />,
    },
    {
      feature: 'Social Radar',
      free: <div className="ml-3">-</div>,
      vip: <ProCheck />,
    },
    {
      feature: 'Alert Screener',
      free: <div className="ml-3">-</div>,
      vip: <ProCheck />,
    },
  ];

  const columns = useMemo<Array<ColumnType<any>>>(
    () => [
      {
        title: (
          <div className="font-medium text-2xl text-v1-content-primary max-md:text-xl">
            Experience
          </div>
        ),
        dataIndex: 'feature',
        render: (_, { feature }) => feature,
      },
      {
        title: (
          <div className="font-medium text-2xl text-v1-content-primary max-md:text-lg">
            Free
          </div>
        ),
        dataIndex: 'free',
        render: (_, { free }) => free,
      },
      {
        title: (
          <div className="relative bg-pro-gradient bg-clip-text font-medium text-2xl text-transparent max-md:text-lg">
            Wise Club
          </div>
        ),
        dataIndex: 'vip',
        render: (_, { vip }) => vip,
      },
    ],
    [],
  );

  return (
    <div className={clsx('relative w-full overflow-hidden', className)}>
      <h2 className="mb-2 text-3xl max-md:text-xl">Compare Tires & Features</h2>
      <hr className="mb-12 border-v1-border-primary max-md:mb-6" />
      <Table
        className="[&_.ant-table-cell]:!rounded-none [&_.ant-table-cell]:!border-b [&_.ant-table-cell]:!bg-transparent [&_.ant-table]:!bg-transparent [&_.ant-table-cell]:border-v1-border-secondary"
        columns={columns}
        dataSource={datasource}
        pagination={false}
      />
      <img
        alt=""
        className="absolute top-[10%] right-[15%] w-[40%] max-md:right-10"
        src={vipBg}
      />
      <p className="mt-2 text-xs">
        * The revenue share system distributes 50% of net revenue among stakers,
        based on how long you were staking during the month and your stake
        amount.
      </p>
    </div>
  );
}
