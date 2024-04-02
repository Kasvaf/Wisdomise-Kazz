import { useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import CoinsIcons from 'modules/shared/CoinsIcons';
import PriceChange from 'modules/shared/PriceChange';
import { type CoinTelegramSignal } from 'api';
import Table from 'modules/shared/Table';
import Button from 'shared/Button';

export default function SignalsTable({
  signals,
}: {
  signals: CoinTelegramSignal[];
}) {
  const { t } = useTranslation('social-radar');

  const columns = useMemo<Array<ColumnType<CoinTelegramSignal>>>(
    () => [
      {
        title: '#',
        render: (row: CoinTelegramSignal) => signals.indexOf(row) + 1,
      },
      {
        title: t('more-telegram-signal.table.coin'),
        render: (row: CoinTelegramSignal) => (
          <div className="flex items-center gap-2">
            <CoinsIcons coins={[row.image]} />
            <p>{row.symbol_name}</p>
          </div>
        ),
      },
      {
        title: t('more-telegram-signal.table.side'),
        render: (row: CoinTelegramSignal) => (
          <p className="capitalize">{row.gauge_tag.toLowerCase()}</p>
        ),
      },
      {
        title: t('more-telegram-signal.table.price'),
        render: (row: CoinTelegramSignal) =>
          row.current_price ? (
            <p>{row.current_price.toString() + ' USDT'}</p>
          ) : (
            '-'
          ),
      },
      {
        title: t('more-telegram-signal.table.price-change'),
        render: (row: CoinTelegramSignal) =>
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
        render: (row: CoinTelegramSignal) => (
          <Button
            className="block w-fit"
            to={'/insight/social-radar/' + row.symbol_name}
          >
            {t('more-telegram-signal.table.explore')}
          </Button>
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
