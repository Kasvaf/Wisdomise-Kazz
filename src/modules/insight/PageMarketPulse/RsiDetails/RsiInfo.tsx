import { clsx } from 'clsx';
import { type ReactNode, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { bxInfoCircle } from 'boxicons-quasar';
import { Tooltip } from 'antd';
import { type useRsiDivergence, type useRsiOverness } from 'api/market-pulse';
import Icon from 'shared/Icon';

const RsiStatistic: FC<{
  label: string;
  value?: number | null;
  info?: ReactNode;
}> = ({ label, value, info }) => {
  const { t } = useTranslation('common');
  const hasValue = typeof value === 'number';
  return (
    <div className="inline-flex flex-col justify-between">
      <div className="mb-px flex items-center gap-2 text-xs font-light">
        {label}
        {info && (
          <Tooltip title={info}>
            <Icon name={bxInfoCircle} size={16} className="text-white/60" />
          </Tooltip>
        )}
      </div>
      <div
        className={clsx(
          'font-normal',
          hasValue ? 'text-2xl' : 'pb-2 text-base opacity-60',
        )}
      >
        {hasValue ? value : t('not-available')}
      </div>
    </div>
  );
};

export const RsiInfo: FC<{
  className?: string;
  overness: ReturnType<typeof useRsiOverness>;
  divergence: ReturnType<typeof useRsiDivergence>;
}> = ({ className, overness, divergence }) => {
  const { t } = useTranslation('market-pulse');
  const isLoading = overness.isLoading || divergence.isLoading;
  const statistics = {
    oversold: overness.data?.data.over_sold.length ?? null,
    overbought: overness.data?.data.over_bought.length ?? null,
    bearish: divergence.data?.data.bearish_divergence.length ?? null,
    bullish: divergence.data?.data.bullish_divergence.length ?? null,
  };

  return (
    <div className={clsx('flex items-center justify-between', className)}>
      {/* Description */}
      <div className="flex flex-col items-stretch justify-between gap-4">
        <div>
          <h2 className="mb-2 text-sm font-normal text-white">
            {t('indicator_list.rsi.title')}
          </h2>
          <p className="text-xs font-light text-white/40">
            {t('indicator_list.rsi.description')}
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-xl bg-black/30 p-5">
          <h3 className="border-b border-b-white/5 pb-3 text-sm">
            {t('indicator_list.rsi.statistics')}{' '}
            <span className="text-xs opacity-50">({t('periods.daily')})</span>
          </h3>
          <div
            className={clsx(
              'grid grid-cols-4 gap-4 mobile:grid-cols-2',
              isLoading && 'animate-pulse',
            )}
          >
            <RsiStatistic
              label={t('indicator_list.rsi.oversold')}
              info={t('indicator_list.rsi.oversold-info')}
              value={statistics.oversold}
            />
            <RsiStatistic
              label={t('indicator_list.rsi.overbought')}
              info={t('indicator_list.rsi.overbought-info')}
              value={statistics.overbought}
            />
            <RsiStatistic
              label={t('indicator_list.rsi.bullish')}
              info={t('indicator_list.rsi.bullish-info')}
              value={statistics.bullish}
            />
            <RsiStatistic
              label={t('indicator_list.rsi.bearish')}
              info={t('indicator_list.rsi.bearish-info')}
              value={statistics.bearish}
            />
          </div>
        </div>
      </div>
      {/* Put Video Here! */}
    </div>
  );
};
