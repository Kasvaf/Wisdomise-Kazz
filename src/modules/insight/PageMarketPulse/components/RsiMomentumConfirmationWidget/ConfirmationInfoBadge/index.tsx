import { type FC, type SVGProps, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { bxInfoCircle } from 'boxicons-quasar';
import { Tooltip } from 'antd';
import {
  type RsiMomentumConfirmationCombination,
  type RsiMomentumConfirmation,
} from 'api/market-pulse';
import Icon from 'shared/Icon';
import { ReactComponent as OversoldIcon } from './oversold.svg';
import { ReactComponent as OverboughtIcon } from './overbought.svg';
import { ReactComponent as BearishIcon } from './bearish.svg';
import { ReactComponent as BullishIcon } from './bullish.svg';

function ConfirmationResolutionRow({ value }: { value: string[] }) {
  const { t } = useTranslation('market-pulse');
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="shrink text-xxs text-v1-content-secondary">
        {t('common.active_timeframe')}
      </div>
      <div className="flex flex-wrap items-center justify-start gap-1">
        {(value?.length ?? 0) === 0 && (
          <span className="text-v1-content-secondary">---</span>
        )}
        {value?.map(row => (
          <div
            key={row}
            className="inline-flex items-center justify-center rounded bg-v1-surface-l4 px-2 py-px text-xxs font-medium"
          >
            {row.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConfirmationInfoBadge({
  type,
  value,
}: {
  type: RsiMomentumConfirmationCombination;
  value: RsiMomentumConfirmation;
}) {
  const { t } = useTranslation('market-pulse');

  const timeframes = useMemo(
    () =>
      [
        ...Object.keys(value.rsi_values ?? {}),
        ...Object.keys(value.divergence_types ?? {}),
      ]
        .filter((key, i, self) => self.indexOf(key) === i)
        .map(row => {
          const labelPower = (s: string) =>
            s.includes('h') ? 60 : s.includes('d') ? 1440 : 1;
          return {
            value: Number.parseInt(row, 10) * labelPower(row.toLowerCase()),
            label: row.toUpperCase(),
          };
        })
        .sort((a, b) => a.value - b.value),
    [value],
  );

  const { icon: DataIcon, ...data } = useMemo<{
    icon: FC<SVGProps<SVGSVGElement>>;
    title: string;
    fullTitle: string;
    resolutions: string[];
    textColor: string;
  }>(() => {
    if (type === 'oversold') {
      return {
        icon: OversoldIcon,
        title: t('indicator_list.rsi.momentum.oversold.badge'),
        fullTitle: t('indicator_list.rsi.momentum.oversold.full_badge'),
        textColor: 'text-v1-content-brand',
        resolutions: value.oversold_resolutions ?? [],
      };
    }
    if (type === 'overbought') {
      return {
        icon: OverboughtIcon,
        title: t('indicator_list.rsi.momentum.overbought.badge'),
        fullTitle: t('indicator_list.rsi.momentum.overbought.full_badge'),
        textColor: 'text-v1-content-notice',
        resolutions: value.overbought_resolutions ?? [],
      };
    }
    if (type === 'bearish_divergence') {
      return {
        icon: BearishIcon,
        title: t('indicator_list.rsi.momentum.bearish.badge'),
        fullTitle: t('indicator_list.rsi.momentum.bearish.full_badge'),
        textColor: 'text-v1-content-negative',
        resolutions: value.bearish_divergence_resolutions ?? [],
      };
    }
    if (type === 'bullish_divergence') {
      return {
        icon: BullishIcon,
        title: t('indicator_list.rsi.momentum.bullish.badge'),
        fullTitle: t('indicator_list.rsi.momentum.bullish.full_badge'),
        textColor: 'text-v1-content-positive',
        resolutions: value.bullish_divergence_resolutions ?? [],
      };
    }
    throw new Error('unexpected error');
  }, [type, t, value]);

  return (
    <div className="inline-flex flex-col items-center justify-center gap-1">
      <div className="inline-flex items-center gap-[0.3rem]">
        <DataIcon
          className={clsx(
            data.resolutions.length === 0 && 'opacity-80 grayscale',
          )}
        />
        <span className="space-x-px">
          <span
            className={clsx(
              'text-xs font-medium',
              data.resolutions.length === 0 && 'opacity-80 grayscale',
              data.textColor,
            )}
          >
            {data.resolutions.length}
          </span>
          <span className="text-xxs text-v1-content-primary">/</span>
          <span className="text-xxs text-v1-content-primary">
            {timeframes.length}
          </span>
        </span>
        <Tooltip
          color="#1e1f24"
          title={
            <div>
              <p className="mb-2 text-xxs text-v1-content-primary">
                {data.fullTitle}
              </p>
              <ConfirmationResolutionRow value={data.resolutions} />
            </div>
          }
        >
          <Icon name={bxInfoCircle} size={18} strokeWidth={1} />
        </Tooltip>
      </div>
      <p className="text-center text-xxs text-v1-content-secondary">
        {data.title}
      </p>
    </div>
  );
}
