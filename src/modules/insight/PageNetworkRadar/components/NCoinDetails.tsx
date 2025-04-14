import { clsx } from 'clsx';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { bxCopy } from 'boxicons-quasar';
import { type NetworkRadarNCoin } from 'api/insight/network';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useShare } from 'shared/useShare';
import { shortenAddress } from 'utils/shortenAddress';
import Icon from 'shared/Icon';
import { useCommunityData } from 'modules/insight/PageCoinDetails/hooks/useCommunityData';
import { NCoinBuySell } from './NCoinBuySell';
import { NCoinLiquidity } from './NCoinLiquidity';

export const NCoinDetails: FC<{
  className?: string;
  value: NetworkRadarNCoin;
}> = ({ value, className }) => {
  const { t } = useTranslation('network-radar');
  const socials = useCommunityData(value.base_community_data).filter(
    x => x.type === 'social',
  );
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
          <NCoinBuySell imgClassName="size-4" value={value} />
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
        {socials.length > 0 && (
          <>
            <p>{t('common.socials')}</p>
            <div className="flex flex-wrap items-center gap-1">
              {socials.map(social => (
                <a
                  key={social.href}
                  href={social.href}
                  className={clsx(
                    'inline-flex items-center gap-1 rounded-full text-xs text-v1-content-primary transition-all bg-v1-surface-l-next hover:brightness-110 active:brightness-90',
                    'size-5 shrink-0 justify-center',
                    '[&_svg]:size-[13px]',
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
      {content}
    </>
  );
};
