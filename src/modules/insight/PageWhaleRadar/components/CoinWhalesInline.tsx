import { bxDotsHorizontal } from 'boxicons-quasar';
import { type FC, useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { type WhaleRadarCoin } from 'api';
import Icon from 'shared/Icon';
import { CoinWhalesWidget } from './CoinWhalesWidget';

export const CoinWhalesInline: FC<{
  value: WhaleRadarCoin;
}> = ({ value }) => {
  const { t } = useTranslation('whale');
  const [isOpen, setIsOpen] = useState(false);

  return (
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
  );
};
