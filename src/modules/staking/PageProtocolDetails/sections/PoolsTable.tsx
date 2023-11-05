import { Tooltip } from 'antd';
import { type ColumnType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';
import { useTranslation } from 'react-i18next';
import { type ProtocolPools, useProtocolPoolsQuery } from 'api/staking';
import PriceChange from 'modules/shared/PriceChange';
import TextBox from 'modules/shared/TextBox';
import Table from 'modules/shared/Table';
import { ReactComponent as InfoIcon } from '../images/info.svg';

export default function PoolsTable() {
  const { t } = useTranslation('staking');
  const params = useParams<{ id: string }>();
  const [tableParams, setTableParams] = useState<TableParams>({ page: 1 });
  const debouncedSearch = useDebounce(tableParams.search, 400);
  const pools = useProtocolPoolsQuery(params.id ?? '', {
    ...tableParams,
    search: debouncedSearch,
  });

  const columns = useMemo<Array<ColumnType<Row>>>(
    () => [
      {
        title: t('pools-table.token'),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        render: ({ defi_symbols }: Row) => {
          const symbols = defi_symbols.map(r => r.symbol);
          return (
            <div className="flex text-xs">
              {symbols.length <= 2 ? (
                symbols.join(', ')
              ) : (
                <>
                  {`${symbols[0]}, ${symbols[1]}, `}
                  <p className=" ml-1 flex items-center  justify-center rounded-full bg-white/80 p-1 text-xxs leading-none text-black">
                    <Tooltip title={symbols.slice(2).join(', ')}>
                      +{symbols.length - 2}
                    </Tooltip>
                  </p>
                </>
              )}
            </div>
          );
        },
      },
      {
        title: (
          <p className="flex items-center gap-3">
            {t('pools-table.apy')}
            <Tooltip title={t('pools-table.apy-title')}>
              <InfoIcon />
            </Tooltip>
          </p>
        ),
        sorter: true,
        dataIndex: 'apy',
        render: (apy: number) => (
          <PriceChange className="w-fit" value={apy} valueToFixed />
        ),
      },
      {
        title: (
          <p className="flex items-center gap-3">
            {t('pools-table.base-apy')}
            <Tooltip title={t('pools-table.base-apy-title')}>
              <InfoIcon />
            </Tooltip>
          </p>
        ),

        // eslint-disable-next-line @typescript-eslint/naming-convention
        render: ({ apy_base }: Row) => (
          <PriceChange className="w-fit" value={apy_base} valueToFixed />
        ),
      },
      {
        title: 'TVL',
        sorter: true,
        dataIndex: 'tvl_usd',
        render: (tvlUsd: number) => '$' + tvlUsd.toLocaleString(),
      },
      {
        title: (
          <p className="flex items-center gap-3">
            {t('pools-table.reward-apy')}
            <Tooltip title={t('pools-table.reward-apy-title')}>
              <InfoIcon />
            </Tooltip>
          </p>
        ),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        render: ({ apy_reward }: Row) =>
          apy_reward ? (
            <PriceChange className="w-fit" value={apy_reward} valueToFixed />
          ) : (
            '---'
          ),
      },
      { title: t('pools-table.chain'), dataIndex: 'chain' },
    ],
    [t],
  );

  return (
    <div className="mt-6 mobile:overflow-auto">
      <div className="mb-2 flex items-center justify-between mobile:sticky mobile:left-0 mobile:flex-col mobile:items-start mobile:gap-3">
        <p className="ml-4 font-semibold">{t('pools-table.title')}</p>
        <div className="flex gap-2">
          <TextBox
            value={tableParams.search ?? ''}
            onChange={v => setTableParams(p => ({ ...p, search: v }))}
            className="w-[300px] text-sm"
            inputClassName="rounded-xl"
            placeholder="Search coin, pool, ..."
          />
        </div>
      </div>
      <Table
        className="mobile:min-w-[750px]"
        pagination={{ total: pools.data?.count }}
        columns={columns}
        onChange={(pagination, _, sorter) =>
          setTableParams(p => ({
            ...p,
            page: pagination.current ?? 1,
            sort:
              !Array.isArray(sorter) && sorter.order && sorter.field
                ? `${
                    sorter.order === 'descend' ? '-' : ''
                  }${sorter.field?.toString()}`
                : '',
          }))
        }
        dataSource={pools.data?.results.pool ?? []}
        loading={pools.isRefetching || pools.isLoading}
      />
    </div>
  );
}

interface TableParams {
  page: number;
  sort?: string;
  search?: string;
}

type Row = ProtocolPools['results']['pool'][number];
