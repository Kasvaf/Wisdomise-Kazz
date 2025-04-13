import { type FC } from 'react';
import { clsx } from 'clsx';
import { bxlTwitter, bxsCopy } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useCoinDetails, usePoolDetails } from 'api';
import { CoinLogo } from 'shared/Coin';
import { shortenAddress } from 'utils/shortenAddress';
import { useShare } from 'shared/useShare';
import Icon from 'shared/Icon';
import { PoolAge } from 'modules/insight/PageNetworkRadar/components/PoolAge';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { PoolBuySell } from 'modules/insight/PageNetworkRadar/components/PoolBuySell';
import { ReadableNumber } from 'shared/ReadableNumber';
import { isDebugMode } from 'utils/version';
import { useCommunityData } from '../hooks/useCommunityData';
import { PriceAlertButton } from './PriceAlertButton';

export const CoinTitleWidget: FC<{
  slug: string;
  className?: string;
  hr?: boolean;
}> = ({ slug, className, hr }) => {
  const { t } = useTranslation('network-radar');
  const [copy, copyNotif] = useShare('copy');
  const coin = useCoinDetails({ slug });
  const pool = usePoolDetails({ slug });
  const isPool = !!pool.data?.base_symbol;
  const symbol = pool.data?.base_symbol || coin.data?.symbol;
  const contactAddresses = [
    pool.data?.base_contract_address,
    ...(pool.data?.base_contract_address
      ? []
      : coin?.data?.networks?.map(x => x?.contract_address) ?? []),
  ].filter(x => !!x) as string[];
  const socials = useCommunityData(
    pool.data?.base_community_data || coin.data?.community_data,
  ).filter(x => x.type === 'social');

  if (!symbol) return null;

  return (
    <>
      <div
        className={clsx('flex items-center justify-between gap-1', className)}
      >
        <div className="flex items-center justify-start gap-2">
          <CoinLogo coin={symbol} className="size-7" />
          <div className="flex flex-col justify-between gap-px">
            <div className="flex items-center gap-1">
              <p className="text-xs font-medium">
                {symbol.abbreviation ?? '---'}
              </p>
              <p className="text-xxs text-v1-content-secondary">
                {symbol.name ?? '---'}
              </p>
              {isPool && (
                <svg
                  width="12"
                  height="11"
                  viewBox="0 0 12 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 7.50002V3.04907"
                    stroke="#00FFA3"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M6 3.54905C6 3.54905 6.25028 1.67249 7.52333 0.937494C8.79638 0.202494 10.5467 0.924031 10.5467 0.924031C10.5467 0.924031 10.2737 2.81371 9.02333 3.53558C7.75028 4.27058 6 3.54905 6 3.54905Z"
                    stroke="#00FFA3"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M5.99976 3.54905C5.99976 3.54905 5.74949 1.67249 4.47644 0.937494C3.20339 0.202494 1.45312 0.924031 1.45312 0.924031C1.45312 0.924031 1.72612 2.81371 2.97644 3.53558C4.24948 4.27058 5.99976 3.54905 5.99976 3.54905Z"
                    stroke="#00FFA3"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M1.5 9.87498C1.5 9.04657 2.17157 8.37498 3 8.37498C3.24583 8.37498 3.47784 8.43412 3.68259 8.53893C3.99919 7.85189 4.69391 7.37497 5.50001 7.37497C6.60458 7.37497 7.5 8.37498 7.5 9.49998"
                    stroke="#00FFA3"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M10.5 9.875C10.5 9.04659 9.9375 8.375 9 8.375"
                    stroke="#00FFA3"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                </svg>
              )}
            </div>
            <div className="flex items-center gap-1">
              {contactAddresses.length === 1 && (
                <>
                  <div className="flex items-center gap-1 text-xxs text-v1-content-secondary">
                    {shortenAddress(contactAddresses[0])}
                    <Icon
                      name={bxsCopy}
                      size={12}
                      className="cursor-pointer"
                      onClick={() => copy(contactAddresses[0])}
                    />
                  </div>
                  <span className="size-[2px] rounded-full bg-white" />
                </>
              )}

              {/* Socials */}
              {socials.length > 0 && (
                <div className="flex flex-nowrap items-center gap-1">
                  {socials.map(social => (
                    <a
                      key={social.href}
                      href={social.href}
                      className={clsx(
                        'inline-flex items-center gap-1 rounded-full bg-white/10 text-xs text-white/70 transition-all hover:brightness-110 active:brightness-90',
                        'size-3 shrink-0 justify-center',
                        '[&_svg]:size-[10px]',
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              )}
              <a
                href={`https://x.com/search?q=(${[
                  symbol.abbreviation && `$${symbol.abbreviation}`,
                  ...contactAddresses,
                ].join('%20OR%20')})&src=typed_query&f=live`}
                className={clsx(
                  'inline-flex items-center gap-2 rounded-full bg-white/10 px-1 text-xxs text-v1-content-secondary transition-all hover:brightness-110 active:brightness-90',
                  'h-4 shrink-0 justify-center',
                  '[&_svg]:size-[12px]',
                )}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name={bxlTwitter} />
                {'Search'}
              </a>

              {/* Developer Data */}
              {isPool && isDebugMode && (
                <>
                  <span className="size-[2px] rounded-full bg-white" />
                  <span className="text-xxs text-v1-content-positive">
                    TODO: Dev
                  </span>
                </>
              )}
              {/* TODO an user icon and his assets history */}

              {pool.data?.creation_datetime && (
                <>
                  <span className="size-[2px] rounded-full bg-white" />
                  <PoolAge
                    value={pool.data?.creation_datetime}
                    inline
                    className="text-xs text-v1-background-secondary"
                  />
                </>
              )}
            </div>
          </div>
          {pool.data && (
            <div className="flex items-center gap-6">
              <div className="h-4 w-px bg-white/10" />
              <div className="space-y-px">
                <p className="text-xxs text-v1-content-secondary">
                  {t('common.buy_sell')}
                </p>
                <PoolBuySell
                  value={pool.data}
                  className="text-xxs"
                  imgClassName="size-4"
                />
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="space-y-px">
                <p className="text-xxs text-v1-content-secondary">
                  {t('common.volume')}
                </p>
                <ReadableNumber
                  value={pool.data.update.total_trading_volume.usd}
                  className="text-xxs"
                  label="$"
                  popup="never"
                />
              </div>
              {isDebugMode && (
                <>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="space-y-px">
                    <p className="text-xxs text-v1-content-secondary">
                      {t('common.risk')}
                    </p>
                    <span className="text-xxs">TODO: Risks</span>

                    {/* TODO Risk */}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end justify-between gap-px">
            <DirectionalNumber
              value={
                pool.data?.update.base_market_data.current_price ??
                coin.data?.data?.current_price
              }
              label="$"
              direction="up"
              className="text-xs"
              showIcon={false}
              showSign={false}
            />
            {coin.data?.data?.price_change_percentage_24h && (
              <DirectionalNumber
                className="text-xxs"
                value={coin.data?.data?.price_change_percentage_24h}
                label="%"
                showSign
                showIcon
                suffix=" (24h)"
              />
            )}
          </div>
          <div className="h-8 w-px bg-white/10" />
          <PriceAlertButton
            slug={slug}
            variant="outline"
            surface={1}
            size="md"
          />
        </div>
        {copyNotif}
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
};
