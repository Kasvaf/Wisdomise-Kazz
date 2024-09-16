import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  type RsiMomentumConbination,
  type RsiMomentumConfirmation,
} from 'api/market-pulse';

function MomentumResolutionRow({
  label,
  value,
}: {
  label: string;
  value?: null | string[];
}) {
  const { t } = useTranslation('market-pulse');
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        {label}
        <span className="ms-1 text-xxs text-v1-content-secondary mobile:ms-0 mobile:block">
          {t('common.in_timeframe')}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-start gap-2">
        {!value && (
          <span className="text-v1-content-secondary">
            {t('common:not-available')}
          </span>
        )}
        {(value?.length ?? -1) === 0 && (
          <span className="text-v1-content-secondary">---</span>
        )}
        {value?.map(row => (
          <div
            key={row}
            className="inline-flex h-5 items-center justify-center rounded bg-v1-surface-l4 p-3 text-xs font-medium"
          >
            {row.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MomentumResolutionStats({
  value,
  combination,
}: {
  value: RsiMomentumConfirmation;
  combination: RsiMomentumConbination[];
}) {
  const { t } = useTranslation('market-pulse');

  return (
    <div
      className={clsx(
        'flex flex-col gap-4 text-xs',
        '[&>div]:flex [&>div]:items-center [&>div]:justify-between [&>div]:gap-4',
      )}
    >
      {combination.includes('oversold') && (
        <MomentumResolutionRow
          label={t('indicator_list.rsi.momentum.oversold.title')}
          value={value.oversold_resolutions}
        />
      )}
      {combination.includes('overbought') && (
        <MomentumResolutionRow
          label={t('indicator_list.rsi.momentum.overbought.title')}
          value={value.overbought_resolutions}
        />
      )}
      {combination.includes('bullish_divergence') && (
        <MomentumResolutionRow
          label={t('indicator_list.rsi.momentum.bullish.title')}
          value={value.bullish_divergence_resolutions}
        />
      )}
      {combination.includes('bearish_divergence') && (
        <MomentumResolutionRow
          label={t('indicator_list.rsi.momentum.bearish.title')}
          value={value.bearish_divergence_resolutions}
        />
      )}
    </div>
  );
}
