import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type WhaleRadarCoin } from 'api';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';

export const WhaleCoinBuySellInfo: FC<{
  value: WhaleRadarCoin;
  type: 'buy' | 'sell';
}> = ({ value, type }) => {
  const { t } = useTranslation('whale');
  const volume =
    (type === 'buy' ? value.total_buy_volume : value.total_sell_volume) ?? 0;
  const number =
    (type === 'buy' ? value.total_buy_number : value.total_sell_number) ?? 0;
  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center gap-1">
        <ReadableNumber value={number} className="text-sm" />
        <DirectionalNumber
          value={volume}
          showSign={false}
          className="text-xs"
          direction={type === 'buy' ? 'up' : 'down'}
          label="$"
        />
      </div>
      <div className="mt-px flex items-center gap-1 whitespace-nowrap text-xs">
        <span className="capitalize text-v1-content-secondary">
          {type === 'buy'
            ? t('top_coins.buy_volume.avg')
            : t('top_coins.sell_volume.avg')}
          :
        </span>
        <ReadableNumber value={volume === 0 ? 0 : volume / number} label="$" />
      </div>
    </div>
  );
};
