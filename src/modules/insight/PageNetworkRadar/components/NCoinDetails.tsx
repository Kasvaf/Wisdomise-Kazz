import { clsx } from 'clsx';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { bxCopy } from 'boxicons-quasar';
import { type NetworkRadarNCoin } from 'api/insight/network';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useShare } from 'shared/useShare';
import { shortenAddress } from 'utils/shortenAddress';
import Icon from 'shared/Icon';
import { CoinCommunityLinks } from 'shared/CoinCommunityLinks';
import { NCoinBuySell } from './NCoinBuySell';
import { NCoinLiquidity } from './NCoinLiquidity';

export const NCoinDetails: FC<{
  className?: string;
  value: NetworkRadarNCoin;
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
          <NCoinLiquidity
            type="update_row"
            value={value}
            imgClassName="size-4"
          />
        </div>
        <p>{t('common.initial_liquidity')}</p>
        <div>
          <NCoinLiquidity
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
          <NCoinBuySell
            imgClassName="size-4"
            value={{
              buys: value.update.total_num_buys,
              sells: value.update.total_num_sells,
            }}
          />
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
        <CoinCommunityLinks
          value={value.base_community_data.links}
          coin={value.base_symbol}
          includeTwitterSearch
          size="xs"
        />
      </div>
      {content}
    </>
  );
};
