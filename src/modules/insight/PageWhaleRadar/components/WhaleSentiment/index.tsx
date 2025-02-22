import { bxDotsHorizontal } from 'boxicons-quasar';
import { type FC, useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { type WhaleRadarCoin } from 'api';
import Icon from 'shared/Icon';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinWhalesWidget } from '../WhaleRadarDesktop/CoinWhalesWidget';
import { ReactComponent as WhaleIcon } from './whale.svg';

export const WhaleSentiment: FC<{
  value: WhaleRadarCoin;
  detailsLevel?: 1 | 2;
}> = ({ value, detailsLevel = 2 }) => {
  const { t } = useTranslation('whale');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {detailsLevel === 2 && (
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
      {detailsLevel === 1 && (
        <div className="inline-flex items-center gap-1">
          <WhaleIcon />
          <div className="w-6">
            <p className="text-xxs text-v1-content-secondary">
              {t('common:number_short')}
            </p>
            <p className="text-xxs font-medium">{value.wallet_count ?? 0}</p>
          </div>
          <div className="flex flex-col gap-1 text-xxs">
            <DirectionalNumber
              value={value.total_buy_volume}
              popup="never"
              direction="up"
              label="$"
              showSign={false}
              showIcon={false}
            />
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
      )}
    </>
  );
};
