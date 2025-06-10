import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { type WhaleRadarSentiment } from 'api/discovery';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';

export const WhaleCoinBuySellInfo: FC<{
  value?: WhaleRadarSentiment | null;
  type: 'buy' | 'sell';
  singleLine?: boolean;
}> = ({ value, type, singleLine }) => {
  const { t } = useTranslation('whale');
  const volume =
    (type === 'buy' ? value?.total_buy_volume : value?.total_sell_volume) ?? 0;
  const number =
    (type === 'buy' ? value?.total_buy_number : value?.total_sell_number) ?? 0;
  return (
    <div
      className={clsx(
        'flex',
        singleLine ? 'items-center gap-2' : 'flex-col items-start gap-px',
      )}
    >
      <div className="flex items-center gap-1">
        <ReadableNumber value={number} className="text-sm" />
        <DirectionalNumber
          value={volume}
          showSign={false}
          className="text-xs"
          direction={type === 'buy' ? 'up' : 'down'}
          label="$"
          format={{
            decimalLength: 1,
          }}
        />
      </div>
      <div className="flex items-center gap-1 whitespace-nowrap text-xs">
        <span className="capitalize text-v1-content-secondary">
          {type === 'buy'
            ? t('top_coins.buy_volume.avg')
            : t('top_coins.sell_volume.avg')}
          :
        </span>
        <ReadableNumber
          value={volume === 0 ? 0 : volume / number}
          label="$"
          format={{
            decimalLength: 1,
          }}
        />
      </div>
    </div>
  );
};
