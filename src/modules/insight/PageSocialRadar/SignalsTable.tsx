import { useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { bxRightArrowAlt } from 'boxicons-quasar';
import CoinsIcons from 'modules/shared/CoinsIcons';
import PriceChange from 'modules/shared/PriceChange';
import { type CoinSignal } from 'api';
import Table from 'modules/shared/Table';
import Icon from 'shared/Icon';

export default function SignalsTable({ signals }: { signals: CoinSignal[] }) {
  const { t } = useTranslation('social-radar');

  const columns = useMemo<Array<ColumnType<CoinSignal>>>(
    () => [
      {
        title: '#',
        render: (row: CoinSignal) => signals.indexOf(row) + 1,
      },
      {
        title: t('more-telegram-signal.table.coin'),
        render: (row: CoinSignal) => (
          <div className="flex items-center gap-2">
            <CoinsIcons coins={[row.image]} />
            <p>{row.symbol_name}</p>
          </div>
        ),
      },
      {
        title: t('more-telegram-signal.table.side'),
        render: (row: CoinSignal) => (
          <p className="capitalize">{row.gauge_tag.toLowerCase()}</p>
        ),
      },
      {
        title: t('more-telegram-signal.table.price'),
        render: (row: CoinSignal) =>
          row.current_price ? (
            <p>{row.current_price.toString() + ' USDT'}</p>
          ) : (
            '-'
          ),
      },
      {
        title: t('more-telegram-signal.table.price-change'),
        render: (row: CoinSignal) =>
          row.price_change_percentage ? (
            <PriceChange
              valueToFixed
              className="!justify-start"
              value={row.price_change_percentage}
            />
          ) : (
            '-'
          ),
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
    [signals, t],
  );

  return (
    <div className="mobile:overflow-auto">
      <p className="py-8 pl-2 font-semibold">
        {t('more-telegram-signal.title')}
      </p>
      <div className="mobile:w-[700px]">
        <Table
          columns={columns}
          dataSource={signals}
          rowKey={row => row.symbol_name}
        />
      </div>
    </div>
  );
}
