import { bxDotsHorizontal } from 'boxicons-quasar';
import { type FC, useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { type WhaleRadarCoin } from 'api';
import Icon from 'shared/Icon';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { WhaleAssetBadge } from 'shared/WhaleAssetBadge';
import { CoinWhalesWidget } from '../WhaleRadarDesktop/CoinWhalesWidget';
import { WhaleCoinBuySellInfo } from '../WhaleCoinBuySellInfo';
import WhaleIcon from './whale.png';
import BuyIcon from './buy.png';
import SellIcon from './sell.png';

export const WhaleSentiment: FC<{
  value: WhaleRadarCoin;
  mode?: 'with_tooltip' | 'expanded' | 'summary';
}> = ({ value, mode = 'with_tooltip' }) => {
  const { t } = useTranslation('whale');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {mode === 'with_tooltip' && (
        <>
          <button
            className="inline-flex items-center gap-1 text-xs"
            onClick={() => setIsOpen(p => !p)}
          >
            {t('whales_on_coin.wallet', {
              count: value.wallet_count ?? 0,
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
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            width={1366}
            className="[&_.ant-modal-content]:!p-2"
          >
            {value.symbol.slug && (
              <>
                <CoinWhalesWidget coin={value.symbol} type="active" />
                <CoinWhalesWidget coin={value.symbol} type="holding" />
              </>
            )}
          </Modal>
        </>
      )}
      {mode === 'summary' && (
        <div className="inline-flex items-center gap-6">
          <div className="flex h-[24px] flex-col items-center justify-between text-center">
            <img src={WhaleIcon} alt="whale" className="w-[16px]" />
            <p className="text-xxs font-medium">{value.wallet_count ?? 0}</p>
          </div>
          <div className="flex flex-col gap-2 text-xxs">
            <div className="flex items-center gap-1">
              <img src={BuyIcon} alt="Buys" className="size-[14px]" />
              <DirectionalNumber
                value={value.total_buy_volume}
                popup="never"
                direction="up"
                label="$"
                showSign={false}
                showIcon={false}
              />
            </div>
            <div className="flex items-center gap-1">
              <img src={SellIcon} alt="Sells" className="size-[14px]" />
              <DirectionalNumber
                value={value.total_sell_volume}
                popup="never"
                direction="down"
                label="$"
                showSign={false}
                showIcon={false}
              />
            </div>
          </div>
        </div>
      )}
      {mode === 'expanded' && (
        <div className="flex flex-col overflow-hidden rounded-xl p-3 bg-v1-surface-l-next">
          <p className="mb-2 text-xs">{t('sentiment.title')}</p>
          <div className="mb-3 flex flex-wrap items-center justify-start gap-px text-sm">
            {value.label_percents.map(label => (
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
      )}
    </>
  );
};
