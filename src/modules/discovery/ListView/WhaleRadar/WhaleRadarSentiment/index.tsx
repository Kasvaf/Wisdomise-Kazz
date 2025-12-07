import type {
  MiniMarketData,
  WhaleRadarSentiment as WhaleRadarSentimentType,
} from 'api/discovery';
import type { Coin as CoinType } from 'api/types/shared';
import { bxDotsHorizontal } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { Coin } from 'shared/Coin';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Dialog } from 'shared/v1-components/Dialog';
import { WhaleAssetBadge } from 'shared/WhaleAssetBadge';
import { WhaleCoinBuySellInfo } from '../WhaleCoinBuySellInfo';
import { CoinWhalesWidget } from '../WhaleRadarExpanded/CoinWhalesWidget';
import BuyIcon from './buy.png';
import SellIcon from './sell.png';
import { useWRSNums } from './useWRSNums';
import WhaleIcon from './whale.png';

export const WhaleRadarSentiment: FC<{
  value?: WhaleRadarSentimentType | null;
  mode: 'default' | 'mini' | 'expanded' | 'card' | 'tiny';
  marketData?: MiniMarketData | null;
  coin?: CoinType | null;
  className?: string;
  contentClassName?: string;
}> = ({ value, marketData, coin, className, mode, contentClassName }) => {
  const { t } = useTranslation('whale');
  const [desktopModal, setDesktopModal] = useState(false);
  const numbers = useWRSNums(value);
  const isAllNumbersZero = numbers.every(x => x.value === 0);

  if (mode === 'default') {
    return (
      <>
        <button
          className={clsx('inline-flex items-center gap-1 text-xs', className)}
          onClick={() => setDesktopModal(p => !p)}
        >
          {t('whales_on_coin.wallet', {
            count: value?.wallet_count ?? 0,
          })}
          <Icon
            className="inline-flex size-3 items-center justify-center rounded-full border"
            name={bxDotsHorizontal}
            size={12}
          />
        </button>
        <Dialog
          className="w-[1366px]"
          closable
          contentClassName="p-3"
          footer={false}
          mode="modal"
          onClose={() => setDesktopModal(false)}
          open={desktopModal}
          surface={2}
        >
          {coin?.slug && (
            <>
              <CoinWhalesWidget coin={coin} type="active" />
              <CoinWhalesWidget coin={coin} type="holding" />
            </>
          )}
        </Dialog>
      </>
    );
  }

  if (mode === 'card') {
    if (isAllNumbersZero) return null;

    return (
      <ClickableTooltip
        chevron={false}
        className={className}
        disabled={isAllNumbersZero}
        title={
          <div className="w-[400px] max-w-full">
            {coin && marketData && (
              <div className="mb-4 flex items-center justify-between gap-4">
                <Coin
                  abbrevationSuffix={
                    <DirectionalNumber
                      className="ms-1"
                      direction="auto"
                      format={{
                        decimalLength: 1,
                        minifyDecimalRepeats: true,
                      }}
                      label="%"
                      showIcon
                      showSign={false}
                      value={marketData?.price_change_percentage_24h}
                    />
                  }
                  coin={coin}
                  imageClassName="size-8"
                  nonLink={true}
                  truncate={260}
                />
                <div className="flex flex-col items-end gap-px">
                  <ReadableNumber
                    className="text-sm"
                    label="$"
                    value={marketData?.current_price}
                  />
                  <CoinMarketCap
                    className="text-xs"
                    marketData={marketData}
                    singleLine
                  />
                </div>
              </div>
            )}
            {!!value?.chart_data?.length && (
              <CoinPriceChart
                className="mb-6 w-full"
                value={
                  value?.chart_data?.map(r => ({
                    related_at: r.related_at,
                    value: r.price,
                  })) ?? []
                }
                whalesActivity={value?.chart_data}
              />
            )}

            <WhaleRadarSentiment
              className="w-full"
              mode="expanded"
              value={value}
            />
          </div>
        }
      >
        <div
          className={clsx(
            contentClassName,
            'flex h-10 w-full items-center gap-3 overflow-hidden whitespace-nowrap rounded-xl bg-v1-surface-l-next p-3',
          )}
        >
          <img
            alt="whale"
            className="h-[18px] w-auto shrink-0"
            src={WhaleIcon}
          />

          <div className="flex items-center justify-between gap-2 text-2xs">
            {numbers.map(num => (
              <div className="text-start" key={num.label}>
                <p
                  className={clsx(
                    isAllNumbersZero && 'text-v1-content-secondary',
                  )}
                >
                  {num.shortLabel}
                </p>
                <ReadableNumber
                  className={clsx('font-medium', num.color)}
                  format={{
                    compactInteger: true,
                    decimalLength: 0,
                    minifyDecimalRepeats: false,
                  }}
                  label="%"
                  popup="never"
                  value={num.value ?? 0}
                />
              </div>
            ))}
          </div>
        </div>
      </ClickableTooltip>
    );
  }

  if (mode === 'mini') {
    return (
      <div className={clsx('inline-flex items-center gap-2', className)}>
        <div className="flex h-[24px] flex-col items-center justify-between text-center">
          <img alt="whale" className="w-[16px]" src={WhaleIcon} />
          <p className="font-medium text-2xs">{value?.wallet_count ?? 0}</p>
        </div>
        <div className="flex flex-col text-2xs">
          <div className="flex items-center gap-1">
            <img alt="Buys" className="size-[8px]" src={BuyIcon} />
            <DirectionalNumber
              direction="up"
              format={{
                decimalLength: 1,
              }}
              label="$"
              popup="never"
              showIcon={false}
              showSign={false}
              value={value?.total_buy_volume}
            />
          </div>
          <div className="flex items-center gap-1">
            <img alt="Sells" className="size-[8px]" src={SellIcon} />
            <DirectionalNumber
              direction="down"
              format={{
                decimalLength: 1,
              }}
              label="$"
              popup="never"
              showIcon={false}
              showSign={false}
              value={value?.total_sell_volume}
            />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'tiny') {
    return (
      <div className="flex flex-col items-center gap-1">
        <img alt="whale" className="w-5" src={WhaleIcon} />
        <p className="font-medium text-xs">{value?.wallet_count ?? 0}</p>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex flex-col overflow-hidden rounded-xl bg-v1-surface-l-next p-3',
        className,
      )}
    >
      <p className="mb-2 text-xs">{t('sentiment.title')}</p>
      <div className="mb-3 flex flex-wrap items-center justify-start gap-px text-sm">
        {value?.label_percents.map(label => (
          <WhaleAssetBadge
            className="h-4 px-2"
            key={label[0]}
            percentage={label[1]}
            value={label[0]}
          />
        ))}
      </div>
      <div className="grid grid-flow-col grid-cols-2 grid-rows-2 items-center gap-x-px gap-y-1 text-xs">
        <div className="col-span-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-v1-content-secondary">
            {t('top_coins.buy_volume.title')}:
          </div>
          <div>
            <WhaleCoinBuySellInfo singleLine type="buy" value={value} />
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-v1-content-secondary">
            {t('top_coins.sell_volume.title')}:
          </div>
          <div>
            <WhaleCoinBuySellInfo singleLine type="sell" value={value} />
          </div>
        </div>
      </div>
    </div>
  );
};
