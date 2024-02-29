import type React from 'react';
import { useMemo } from 'react';
import { styled } from '@linaria/react';
import * as numerable from 'numerable';
import { Table } from 'antd';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { useInvestorAssetStructuresQuery } from 'api';
import CoinsIcons from 'shared/CoinsIcons';

interface Row {
  key: React.Key;
  coin: string;
  amount: number;
  share: number;
  equity: number;
}

const AssetBindingsSectionTable = () => {
  const { t } = useTranslation('asset-overview');
  const ias = useInvestorAssetStructuresQuery();
  const data = ias.data?.[0];

  const columns = useMemo<Array<ColumnType<Row>>>(
    () => [
      {
        title: t('portfolio.table.coin', { nsSeparator: '.' }),
        dataIndex: 'coin',
        width: '100px',
        render: coin => (
          <div className="inline-flex items-center justify-center">
            <CoinsIcons coins={[coin]} size="small" />
            <span className="ml-3 text-xs leading-none">{coin}</span>
          </div>
        ),
      },
      {
        title: t('portfolio.table.amount'),
        dataIndex: 'amount',
        render: amount =>
          numerable.format(Math.abs(amount), '0,0.00', { rounding: 'floor' }),
      },
      {
        title: t('portfolio.table.equity'),
        dataIndex: 'equity',
        render: equity =>
          numerable.format(equity, '0,0.00', { rounding: 'floor' }),
      },
      {
        title: t('portfolio.table.share'),
        dataIndex: 'share',
        render: share => numerable.format(share / 100, '0.00 %'),
      },
    ],
    [t],
  );

  const tableData =
    data?.asset_bindings.map<Row>(a => ({
      key: a.asset.base.name,
      coin: a.asset.base.name,
      amount: a.amount,
      equity: a.equity,
      share: a.share,
    })) ?? [];

  return (
    <TableWrapper>
      <Table
        columns={columns}
        dataSource={[...tableData]}
        pagination={false}
        scroll={{ y: 170 }}
      />
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  display: block;

  .ant-table {
    @apply rounded-2xl bg-white/5 p-4 text-white mobile:!min-h-full;
    min-height: 248px;

    .ant-table-header {
      @apply mb-2;
    }
  }

  .ant-table-thead .ant-table-cell {
    @apply border-white/10 !bg-transparent p-0 pb-4 text-xs text-white/80;

    &:before {
      @apply !bg-transparent;
    }
  }

  .ant-table-thead .ant-table-cell-scrollbar {
    @apply shadow-none;
  }

  .ant-table-row {
    .ant-table-cell {
      @apply border-none px-0 py-2 text-xs font-medium;
    }

    &:last-child .ant-table-cell {
      @apply pb-0;
    }

    &:hover > .ant-table-cell {
      @apply !bg-transparent;
    }
  }

  *::-webkit-scrollbar {
    width: 4px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background-color: white;
    border-radius: 10px;
    border: 8px solid transparent;
  }

  .ant-table-placeholder {
    @apply !bg-transparent;

    .ant-table-cell {
      @apply border-b-0;

      .ant-empty-description {
        @apply text-white/80;
      }
    }
  }
`;

export default AssetBindingsSectionTable;
