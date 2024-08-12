import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useMemo, type FC, type ReactNode } from 'react';
import { type ColumnType } from 'antd/es/table';
import {
  type CoinExchange,
  useHasFlag,
  type CoinSignal,
  type CoinOverview,
} from 'api';
import PriceChange from 'shared/PriceChange';
import useIsMobile from 'utils/useIsMobile';
import useModal from 'shared/useModal';
import Table from 'shared/Table';
import { ReadableNumber } from 'shared/ReadableNumber';
import SideSuggestGauge from '../PageCoinRadar/SideSuggestGauge';
import { ReactComponent as ArrowRight } from './images/arrow-right.svg';
import { PriceAlertButton } from './PriceAlert';

export const ExchangesModal: FC<{
  exchanges: CoinExchange[];
}> = ({ exchanges }) => {
  const { t } = useTranslation('coin-radar');
  const columns = useMemo<Array<ColumnType<CoinExchange>>>(
    () => [
      {
        title: t('available-exchanges.table.rank'),
        dataIndex: 'coin_ranking_rank',
        render: (rank: number) => rank,
      },
      {
        title: t('available-exchanges.table.exchange'),
        render: (row: CoinExchange) => (
          <div className="flex items-center gap-2 whitespace-nowrap">
            <img
              src={row.exchange.icon_url}
              alt={row.exchange.name}
              className="h-6 w-6 rounded-full bg-white object-scale-down p-1"
            />
            <p>{row.exchange.name}</p>
          </div>
        ),
      },
      {
        title: t('available-exchanges.table.price'),
        dataIndex: 'price_in_usd',
        render: (value?: number) => (
          <ReadableNumber value={value || 0} label="$" />
        ),
      },
      {
        title: t('available-exchanges.table.volume_24h'),
        dataIndex: 'volume_24h',
        render: (value?: number) => (
          <ReadableNumber value={value || 0} label="$" />
        ),
      },
      {
        title: t('available-exchanges.table.volume_percentage'),
        dataIndex: 'volume_percentage',
        render: (value: number) => (
          <ReadableNumber value={value || 0} label="%" />
        ),
      },
    ],
    [t],
  );
  return (
    <div className="max-h-[calc(100vh-4rem)] overflow-auto rounded-3xl px-4">
      <div className="mb-2 py-4 text-base mobile:py-5">
        {t('available-exchanges.title')}
      </div>
      <Table
        columns={columns}
        dataSource={exchanges}
        rowKey={row => row.exchange.id}
        bordered={false}
      />
    </div>
  );
};

export default function CoinInfo({
  className,
  signal,
  overview,
}: {
  className?: string;
  signal?: CoinSignal;
  overview: CoinOverview;
}) {
  const { t } = useTranslation('coin-radar');
  const hasFlag = useHasFlag();
  const isMobile = useIsMobile();
  const [exchangesModal, openExchangesModal] = useModal(ExchangesModal, {
    width: isMobile ? '95%' : '60%',
    wrapClassName: '[&_.ant-modal-content]:!p-0',
    className: '!bg-transparent rounded-3xl',
  });

  return (
    <section
      className={clsx(
        'flex flex-col gap-3 rounded-xl bg-black/10 p-4',
        className,
      )}
    >
      <div
        className={clsx(
          'flex rounded-lg bg-black/20 p-3',
          'h-[72px] items-center justify-between',
          'mobile:grid mobile:h-auto mobile:grid-cols-2 mobile:gap-6',
        )}
      >
        <InfoSection
          value={
            <div className="flex items-center gap-2 mobile:justify-center">
              {overview.data?.image ? (
                <img
                  src={overview.data?.image}
                  className="size-10 rounded-full bg-white/10"
                />
              ) : (
                <div className="size-10 rounded-full bg-white/10" />
              )}
              <div>
                <p className="text-lg font-medium">
                  {overview.symbol.abbreviation}
                </p>
                {overview.symbol.name && (
                  <p className="-mt-px text-xs font-light opacity-70">
                    {overview.symbol.name}
                  </p>
                )}
              </div>
            </div>
          }
        />

        {hasFlag('/insight/coin-radar?side-suggestion') &&
          typeof signal?.gauge_measure === 'number' && (
            <>
              <InfoSection
                value={
                  <div className="flex items-center gap-2 mobile:justify-center">
                    <SideSuggestGauge measure={signal.gauge_measure} />
                    <div>
                      <p className="font-medium capitalize">
                        {signal?.gauge_tag.toLowerCase()}
                      </p>
                      <p className="mt-1 text-xxs text-white/60">
                        {t('hot-coins.side-suggest')}
                      </p>
                    </div>
                  </div>
                }
              />
            </>
          )}

        <InfoSection
          title={t('coin-info.price')}
          value={
            <ReadableNumber value={overview.data?.current_price} label="usdt" />
          }
        />

        <InfoSection
          title={t('coin-info.24h_chg')}
          value={
            <PriceChange
              textClassName="!text-base !leading-none"
              value={overview.data?.price_change_percentage_24h}
            />
          }
        />

        <InfoSection
          title={t('coin-info.market_cap')}
          value={<ReadableNumber value={overview.data?.market_cap} label="$" />}
        />

        <InfoSection
          title={t('coin-info.volume_24h')}
          value={
            <ReadableNumber value={overview.data?.total_volume} label="$" />
          }
        />
      </div>
      <div className="flex justify-between px-1">
        <PriceAlertButton symbol={overview.symbol.abbreviation} />
        <div className="grow" />
        <button
          className={clsx(
            'flex items-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-50',
          )}
          disabled={!overview.exchanges || overview.exchanges.length === 0}
          onClick={() =>
            openExchangesModal({
              exchanges: overview.exchanges,
            })
          }
        >
          {t('available-exchanges.title')} <ArrowRight />
        </button>
        {exchangesModal}
      </div>
    </section>
  );
}

const InfoSection = (props: { title?: string; value: ReactNode }) => (
  <div className="flex h-auto flex-col items-center justify-between gap-2 px-2">
    {props.title && (
      <div className="text-xs font-light text-white/60">{props.title}</div>
    )}
    <div className="text-white/80">{props.value}</div>
  </div>
);
