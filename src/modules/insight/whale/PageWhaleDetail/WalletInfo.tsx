import { bxInfoCircle, bxRefresh } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import PriceChange from 'shared/PriceChange';
import { type SingleWhale } from 'api';

export const WhaletInfo: FC<{
  whale?: SingleWhale;
  onRefresh?: () => void;
  loading?: boolean;
  className?: string;
}> = ({ className, whale, onRefresh, loading }) => {
  const { t } = useTranslation('whale');

  return (
    <div className={clsx('flex flex-col gap-3 p-6', className)}>
      <div className="flex items-center justify-between">
        <ReadableNumber
          className="text-3xl font-bold"
          value={whale?.last_30_balance_updates[0]?.balance_usdt}
          label="usdt"
          format={{
            decimalLength: 1,
          }}
        />
        <button disabled={loading} onClick={onRefresh}>
          <Icon
            name={bxRefresh}
            size={24}
            className={clsx(loading && 'animate-spin')}
          />
        </button>
      </div>
      <div>
        <PriceChange
          className="!inline-flex"
          textClassName="!text-xl"
          value={whale?.last_30_days_trading_pnl_percentage}
        />
      </div>
      <div className="grow" />
      <div className="flex items-center justify-between">
        <label className="text-sm opacity-30">
          {t('sections.whale-info.realized-pnl')}
          <Tooltip
            title={
              <Trans
                i18nKey="sections.whale-info.realized-pnl-info"
                ns="whale"
                components={{
                  b: <div className="mb-1 text-sm font-bold" />,
                  p: <p className="text-xxs font-light opacity-80" />,
                }}
              />
            }
          >
            <Icon
              name={bxInfoCircle}
              className="ms-1 inline-block align-middle"
              size={16}
            />
          </Tooltip>
        </label>
        <ReadableNumber
          className={clsx(
            'text-base',
            (whale?.last_30_days_trading_realized_pnl ?? 0) >= 0
              ? 'text-[#40F19C]'
              : 'text-[#F14056]',
          )}
          value={whale?.last_30_days_trading_realized_pnl}
          label="usdt"
        />
      </div>
      <hr className="opacity-5" />
      <div className="flex items-center justify-between">
        <label className="text-sm opacity-30">
          {t('sections.whale-info.unrealized-pnl')}
          <Tooltip
            title={
              <Trans
                i18nKey="sections.whale-info.unrealized-pnl-info"
                ns="whale"
                components={{
                  b: <div className="mb-1 text-sm font-bold" />,
                  p: <p className="text-xxs font-light opacity-80" />,
                }}
              />
            }
          >
            <Icon
              name={bxInfoCircle}
              className="ms-1 inline-block align-middle"
              size={16}
            />
          </Tooltip>
        </label>
        <ReadableNumber
          className={clsx(
            'text-base',
            (whale?.last_30_days_trading_pnl ?? 0) >= 0
              ? 'text-[#40F19C]'
              : 'text-[#F14056]',
          )}
          value={whale?.last_30_days_trading_pnl}
          label="usdt"
        />
      </div>
    </div>
  );
};
