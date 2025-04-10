/* eslint-disable import/max-dependencies */
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bxDotsHorizontal } from 'boxicons-quasar';
import { Modal } from 'antd';
import { clsx } from 'clsx';
import { type WhaleRadarSentiment as WhaleRadarSentimentType } from 'api';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { type Coin as CoinType, type MiniMarketData } from 'api/types/shared';
import { Coin } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { ReadableNumber } from 'shared/ReadableNumber';
import Icon from 'shared/Icon';
import { WhaleAssetBadge } from 'shared/WhaleAssetBadge';
import { CoinWhalesWidget } from '../WhaleRadarDesktop/CoinWhalesWidget';
import { WhaleCoinBuySellInfo } from '../WhaleCoinBuySellInfo';
import WhaleIcon from './whale.png';
import BuyIcon from './buy.png';
import SellIcon from './sell.png';
import { useWRSNums } from './useWRSNums';
import { WRSProgress } from './WRSProgress';

export const WhaleRadarSentiment: FC<{
  value?: WhaleRadarSentimentType | null;
  mode: 'default' | 'mini' | 'expanded' | 'card' | 'tiny';
  marketData?: MiniMarketData | null;
  coin?: CoinType | null;
  className?: string;
}> = ({ value, marketData, coin, className, mode }) => {
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
            name={bxDotsHorizontal}
            size={12}
            className="inline-flex size-3 items-center justify-center rounded-full border"
          />
        </button>
        <Modal
          centered
          closable
          footer={false}
          open={desktopModal}
          onCancel={() => setDesktopModal(false)}
          width={1366}
          className="[&_.ant-modal-content]:!p-2"
        >
          {coin?.slug && (
            <>
              <CoinWhalesWidget coin={coin} type="active" />
              <CoinWhalesWidget coin={coin} type="holding" />
            </>
          )}
        </Modal>
      </>
    );
  }

  if (mode === 'card') {
    return (
      <ClickableTooltip
        chevron={false}
        title={
          <div className="w-[400px] max-w-full">
            {coin && marketData && (
              <div className="mb-4 flex items-center justify-between gap-4">
                <Coin
                  coin={coin}
                  imageClassName="size-8"
                  nonLink={true}
                  truncate={260}
                  abbrevationSuffix={
                    <DirectionalNumber
                      className="ms-1"
                      value={marketData?.price_change_percentage_24h}
                      label="%"
                      direction="auto"
                      showIcon
                      showSign={false}
                      format={{
                        decimalLength: 1,
                        minifyDecimalRepeats: true,
                      }}
                    />
                  }
                />
                <div className="flex flex-col items-end gap-px">
                  <ReadableNumber
                    value={marketData?.current_price}
                    label="$"
                    className="text-sm"
                  />
                  <CoinMarketCap
                    marketData={marketData}
                    singleLine
                    className="text-xs"
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
              value={value}
              mode="expanded"
              className="w-full"
            />
          </div>
        }
        disabled={isAllNumbersZero}
        className={className}
      >
        <div className="flex h-36 w-full flex-col justify-between gap-1 overflow-hidden whitespace-nowrap rounded-xl p-3 bg-v1-surface-l-next">
          <div className="flex items-start justify-between gap-2">
            <p className="whitespace-nowrap text-xs">{t('sentiment.title')}</p>
          </div>
          <div className="flex items-center justify-between gap-2 text-xxs">
            {numbers.map(num => (
              <div key={num.label} className="text-start">
                <p>{num.label}</p>
                <ReadableNumber
                  value={num.value ?? 0}
                  className={clsx('font-medium', num.color)}
                  popup="never"
                  format={{
                    compactInteger: true,
                    decimalLength: 1,
                    minifyDecimalRepeats: false,
                  }}
                  label="%"
                />
              </div>
            ))}
          </div>
          <WRSProgress value={value?.label_percents ?? []} />
        </div>
      </ClickableTooltip>
    );
  }

  if (mode === 'mini') {
    return (
      <div className={clsx('inline-flex items-center gap-6', className)}>
        <div className="flex h-[24px] flex-col items-center justify-between text-center">
          <img src={WhaleIcon} alt="whale" className="w-[16px]" />
          <p className="text-xxs font-medium">{value?.wallet_count ?? 0}</p>
        </div>
        <div className="flex flex-col gap-2 text-xxs">
          <div className="flex items-center gap-1">
            <img src={BuyIcon} alt="Buys" className="size-[14px]" />
            <DirectionalNumber
              value={value?.total_buy_volume}
              popup="never"
              direction="up"
              label="$"
              showSign={false}
              showIcon={false}
              format={{
                decimalLength: 1,
              }}
            />
          </div>
          <div className="flex items-center gap-1">
            <img src={SellIcon} alt="Sells" className="size-[14px]" />
            <DirectionalNumber
              value={value?.total_sell_volume}
              popup="never"
              direction="down"
              label="$"
              showSign={false}
              showIcon={false}
              format={{
                decimalLength: 1,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'tiny') {
    return (
      <div className="flex items-center gap-2">
        <img src={WhaleIcon} alt="whale" className="w-[24px]" />
        <p className="text-xs font-medium">{value?.wallet_count ?? 0}</p>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex flex-col overflow-hidden rounded-xl p-3 bg-v1-surface-l-next',
        className,
      )}
    >
      <p className="mb-2 text-xs">{t('sentiment.title')}</p>
      <div className="mb-3 flex flex-wrap items-center justify-start gap-px text-sm">
        {value?.label_percents.map(label => (
          <WhaleAssetBadge
            key={label[0]}
            value={label[0]}
            percentage={label[1]}
            className="h-4 px-2"
          />
        ))}
      </div>
      <div className="grid grid-flow-col grid-cols-2 grid-rows-2 items-center gap-x-px gap-y-1 text-xs">
        <div className="col-span-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-v1-content-secondary">
            {t('top_coins.buy_volume.title')}:
          </div>
          <div>
            <WhaleCoinBuySellInfo value={value} type="buy" singleLine />
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-v1-content-secondary">
            {t('top_coins.sell_volume.title')}:
          </div>
          <div>
            <WhaleCoinBuySellInfo value={value} type="sell" singleLine />
          </div>
        </div>
      </div>
    </div>
  );
};
