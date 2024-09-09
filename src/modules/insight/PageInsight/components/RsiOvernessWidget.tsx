import { useTranslation } from 'react-i18next';
import { useRsiOverness, type RsiOvernessResponse } from 'api/market-pulse';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/Coin';
import { RsiNumber } from 'shared/RsiNumber';
import { OverviewWidget } from 'shared/OverviewWidget';
import { useHasFlag } from 'api';
import { SeeMoreLink } from './SeeMoreLink';

export function RsiOvernessWidget({
  type,
  className,
}: {
  type: keyof RsiOvernessResponse;
  className?: string;
}) {
  const { t } = useTranslation('market-pulse');
  const overness = useRsiOverness();
  const hasFlag = useHasFlag();

  if (!hasFlag('/insight/market-pulse')) return null;

  return (
    <OverviewWidget
      title={
        type === 'over_sold'
          ? t('indicator_list.rsi.oversold-full-title')
          : t('indicator_list.rsi.overbought-full-title')
      }
      info={
        type === 'over_sold'
          ? t('indicator_list.rsi.oversold-info')
          : t('indicator_list.rsi.overbought-info')
      }
      className={className}
      contentClassName="flex flex-col gap-4"
      headerActions={<SeeMoreLink to="/insight/market-pulse" />}
    >
      {overness.data?.data[type].slice(0, 5).map((row, idx) => (
        <div
          key={`${row.candle_base_abbreviation}-${idx}`}
          className="flex shrink-0 flex-col gap-2 overflow-auto rounded-lg bg-v1-surface-l3 p-4"
        >
          <div className="flex items-center justify-between">
            <Coin
              coin={{
                abbreviation: row.candle_base_abbreviation,
                name: row.candle_base_name,
                slug: row.candle_base_slug,
                logo_url: row.image,
              }}
            />
            <div className="flex items-center gap-2">
              <ReadableNumber
                label="usdt"
                value={row.current_price}
                className="text-sm"
              />
              <PriceChange
                className="text-xxs"
                value={row.price_change_percentage}
              />
            </div>
          </div>
          <hr className="border-v1-border-tertiary" />
          <div className="flex items-center justify-between gap-4">
            {(['15m', '30m', '1h', '4h', '1d'] as const).map(time => (
              <div key={time}>
                <div className="text-xxs text-v1-content-secondary">
                  {t('indicator_list.rsi.table.rsi')}
                  <span className="ms-1 text-xxs">({time})</span>
                </div>
                <RsiNumber
                  className="text-sm"
                  value={row[`rsi_value_${time}`]}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </OverviewWidget>
  );
}
