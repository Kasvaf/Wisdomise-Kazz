import { clsx } from 'clsx';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { bxCopy } from 'boxicons-quasar';
import { type NetworkRadarPool } from 'api/insight/network';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useShare } from 'shared/useShare';
import { shortenAddress } from 'utils/shortenAddress';
import Icon from 'shared/Icon';
import { CoinSocials } from 'modules/insight/PageCoinDetails/components/CoinLinksWidget';
import { PoolBuySell } from './PoolBuySell';
import { PoolLiquidity } from './PoolLiquidity';

export const PoolDetails: FC<{
  className?: string;
  value: NetworkRadarPool;
}> = ({ value, className }) => {
  const { t } = useTranslation('network-radar');
  const [copy, content] = useShare('copy');
  return (
    <>
      <div
        className={clsx(
          'grid grid-cols-2 gap-3 text-xs [&>div]:justify-self-end',
          className,
        )}
      >
        <p>{t('common.liquidity')}</p>
        <div>
          <PoolLiquidity
            type="update_row"
            value={value}
            imgClassName="size-4"
          />
        </div>
        <p>{t('common.initial_liquidity')}</p>
        <div>
          <PoolLiquidity
            type="initial_row"
            value={value}
            imgClassName="size-4"
          />
        </div>
        <p>{t('common.marketcap')}</p>
        <div>
          <ReadableNumber
            label="$"
            value={value.update.base_market_data.market_cap}
            popup="never"
          />
        </div>
        <p>{t('common.buy_sell')}</p>
        <div>
          <PoolBuySell imgClassName="size-4" value={value} />
        </div>
        <p>{t('common.volume')}</p>
        <div>
          <ReadableNumber
            label="$"
            value={value.update.total_trading_volume.usd}
            popup="never"
          />
        </div>
        <p>{t('common.contract_address')}</p>
        <div className="flex items-center gap-1">
          <Icon
            name={bxCopy}
            size={14}
            className="cursor-pointer"
            onClick={() => copy(value.base_contract_address)}
          />
          {shortenAddress(value.base_contract_address)}
        </div>
        <p>{t('common.socials')}</p>
        <div className="flex flex-wrap items-center gap-2">
          <CoinSocials
            value={value.base_community_data}
            iconsOnly
            className="gap-1"
          />
        </div>
      </div>
      {content}
    </>
  );
};
