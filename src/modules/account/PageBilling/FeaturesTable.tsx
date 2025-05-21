import { useMemo } from 'react';
import type { ColumnType } from 'antd/es/table';
import { Table } from 'antd';
import { clsx } from 'clsx';
import { ReactComponent as Check } from './images/check2.svg';
import { ReactComponent as ProCheck } from './images/pro-check.svg';
import vipBg from './images/vip-bg.png';

export function FeaturesTable({ className }: { className?: string }) {
  const datasource = [
    {
      feature: 'Trade Fee (%)',
      free: <div className="text-xl">0.8</div>,
      vip: (
        <div className="bg-pro-gradient bg-clip-text text-xl font-medium text-transparent">
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
          <div className="text-2xl font-medium text-v1-content-primary mobile:text-lg">
            Free
          </div>
        ),
        dataIndex: 'free',
        render: (_, { free }) => free,
      },
      {
        title: (
          <div className="relative bg-pro-gradient bg-clip-text text-2xl font-medium text-transparent mobile:text-lg">
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
      <h2 className="mb-2 text-3xl mobile:text-xl">Compare Tires & Features</h2>
      <hr className="mb-12 border-v1-border-primary mobile:mb-6" />
      <Table
        className="[&_.ant-table-cell]:!rounded-none [&_.ant-table-cell]:!border-b [&_.ant-table-cell]:border-v1-border-secondary [&_.ant-table-cell]:!bg-transparent [&_.ant-table]:!bg-transparent"
        columns={columns}
        dataSource={datasource}
        pagination={false}
      />
      <img
        src={vipBg}
        className="absolute right-[15%] top-[10%] w-[40%] mobile:right-10"
        alt=""
      />
    </div>
  );
}
