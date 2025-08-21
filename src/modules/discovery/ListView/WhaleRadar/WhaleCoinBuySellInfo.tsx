import type { WhaleRadarSentiment } from 'api/discovery';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
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
        <ReadableNumber className="text-sm" value={number} />
        <DirectionalNumber
          className="text-xs"
          direction={type === 'buy' ? 'up' : 'down'}
          format={{
            decimalLength: 1,
          }}
          label="$"
          showSign={false}
          value={volume}
        />
      </div>
      <div className="flex items-center gap-1 whitespace-nowrap text-xs">
        <span className="text-v1-content-secondary capitalize">
          {type === 'buy'
            ? t('top_coins.buy_volume.avg')
            : t('top_coins.sell_volume.avg')}
          :
        </span>
        <ReadableNumber
          format={{
            decimalLength: 1,
          }}
          label="$"
          value={volume === 0 ? 0 : volume / number}
        />
      </div>
    </div>
  );
};
