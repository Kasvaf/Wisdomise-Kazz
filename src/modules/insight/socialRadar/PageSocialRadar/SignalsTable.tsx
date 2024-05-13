import { useMemo, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { bxRightArrowAlt } from 'boxicons-quasar';
import * as numerable from 'numerable';
import { Select } from 'antd';
import CoinsIcons from 'modules/shared/CoinsIcons';
import PriceChange from 'modules/shared/PriceChange';
import { type CoinSignal } from 'api';
import Table from 'modules/shared/Table';
import Icon from 'shared/Icon';

export default function SignalsTable({ signals }: { signals: CoinSignal[] }) {
  const { t } = useTranslation('social-radar');
  const [filters, setFilters] = useState({ sentiment: '' });

  const columns = useMemo<Array<ColumnType<CoinSignal>>>(
    () => [
      {
        title: t('more-social-signal.table.rank'),
        dataIndex: 'rank',
        sorter: (a, b) => a.rank - b.rank,
        render: (rank: number) => rank,
      },
      {
        title: t('more-social-signal.table.coin'),
        render: (row: CoinSignal) => (
          <div className="flex items-center gap-2">
            <CoinsIcons coins={[row.image || '']} />
            <p>{row.symbol_name}</p>
          </div>
        ),
      },
      {
        title: t('more-social-signal.table.side'),
        render: (row: CoinSignal) => (
          <p className="capitalize">{row.gauge_tag.toLowerCase()}</p>
        ),
      },
      {
        title: t('more-social-signal.table.price'),
        dataIndex: 'current_price',
        sorter: (a, b) => (a.current_price || 0) - (b.current_price || 0),
        render: (currentPrice?: number) =>
          currentPrice ? <p>{`${currentPrice} USDT`}</p> : '-',
      },
      {
        title: t('more-social-signal.table.price-change'),
        dataIndex: 'price_change_percentage',
        sorter: (a, b) =>
          (a.price_change_percentage || 0) - (b.price_change_percentage || 0),
        render: (priceChangePercent?: number) =>
          priceChangePercent ? (
            <PriceChange
              valueToFixed
              className="!justify-start"
              value={priceChangePercent}
            />
          ) : (
            '-'
          ),
      },
      {
        title: t('more-social-signal.table.market-cap'),
        dataIndex: 'market_cap',
        sorter: (a, b) => (a.market_cap || 0) - (b.market_cap || 0),
        render: (marketCap?: number) =>
          marketCap ? (
            <>
              <span className="mr-[2px] font-light text-white/40">$</span>
              {numerable.format(marketCap, '0,0.0 a')}
            </>
          ) : (
            '-'
          ),
      },
      {
        title: t('more-social-signal.table.mentions'),
        dataIndex: 'messages_count',
        sorter: (a, b) => a.messages_count - b.messages_count,
        render: (msgCount: number) => <p>{msgCount}</p>,
      },
      {
        render: (row: CoinSignal) => (
          <NavLink
            to={'/insight/social-radar/' + row.symbol_name}
            className="mx-auto inline-flex items-center justify-end text-sm opacity-40"
          >
            <p className="leading-none">{t('hot-coins.signals')}</p>
            <Icon name={bxRightArrowAlt} />
          </NavLink>
        ),
      },
    ],
    [t],
  );

  const filteredSignals = useMemo(
    () =>
      signals.filter(row =>
        filters.sentiment
          ? row.gauge_tag.toLowerCase() === filters.sentiment
          : true,
      ),
    [filters.sentiment, signals],
  );

  return (
    <div className="mobile:overflow-auto">
      <div className="flex items-center justify-between mobile:flex-col mobile:items-start mobile:pb-4">
        <p className="py-8 pl-2 font-semibold mobile:pb-4">
          {t('more-social-signal.title')}
        </p>
        <Select
          allowClear
          className="min-w-60"
          onChange={sentiment => setFilters({ sentiment })}
          placeholder={t('more-social-signal.table.side')}
          options={[
            { label: 'Long', value: 'long' },
            { label: 'Short', value: 'short' },
            { label: 'Neutral', value: 'neutral' },
          ]}
        />
      </div>
      <div className="mobile:w-[700px]">
        <Table
          columns={columns}
          dataSource={filteredSignals}
          rowKey={row => row.symbol_name}
        />
      </div>
    </div>
  );
}
