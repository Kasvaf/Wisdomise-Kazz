import { type FC, type SVGProps, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { bxInfoCircle } from 'boxicons-quasar';
import { Tooltip } from 'antd';
import {
  type Indicator,
  type IndicatorConfirmationCombination,
  type IndicatorConfirmation,
} from 'api/market-pulse';
import Icon from 'shared/Icon';
import { ReactComponent as OversoldIcon } from './oversold.svg';
import { ReactComponent as OverboughtIcon } from './overbought.svg';
import { ReactComponent as BearishIcon } from './bearish.svg';
import { ReactComponent as BullishIcon } from './bullish.svg';
import { ReactComponent as CrossupIcon } from './crossup.svg';
import { ReactComponent as CrossdownIcon } from './crossdown.svg';

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

export function ConfirmationInfoBadge<I extends Indicator>({
  type,
  value,
}: {
  type: IndicatorConfirmationCombination<I>;
  value: IndicatorConfirmation<I>;
}) {
  const { t } = useTranslation('market-pulse');

  const timeframes = useMemo(
    () =>
      [
        ...Object.keys(
          (value as IndicatorConfirmation<'rsi'>)?.rsi_values ?? {},
        ),
        ...Object.keys(
          (value as IndicatorConfirmation<'macd'>)?.macd_values ?? {},
        ),
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
    const typeAsRsi = type as IndicatorConfirmationCombination<'rsi'>;
    const typeAsMacd = type as IndicatorConfirmationCombination<'macd'>;
    const valueAsRsi = value as IndicatorConfirmation<'rsi'>;
    const valueAsMacd = value as IndicatorConfirmation<'macd'>;
    if (typeAsRsi === 'oversold') {
      return {
        icon: OversoldIcon,
        title: t('indicator_list.rsi.oversold.badge'),
        fullTitle: t('indicator_list.rsi.oversold.full_badge'),
        textColor: 'text-v1-content-brand',
        resolutions: valueAsRsi.oversold_resolutions ?? [],
      };
    }
    if (typeAsRsi === 'overbought') {
      return {
        icon: OverboughtIcon,
        title: t('indicator_list.rsi.overbought.badge'),
        fullTitle: t('indicator_list.rsi.overbought.full_badge'),
        textColor: 'text-v1-content-notice',
        resolutions: valueAsRsi.overbought_resolutions ?? [],
      };
    }
    if (typeAsMacd === 'macd_cross_up') {
      return {
        icon: CrossupIcon,
        title: t('indicator_list.macd.crossup.badge'),
        fullTitle: t('indicator_list.macd.crossup.full_badge'),
        textColor: 'text-v1-content-brand',
        resolutions: valueAsMacd.macd_cross_up_resolutions ?? [],
      };
    }
    if (typeAsMacd === 'macd_cross_down') {
      return {
        icon: CrossdownIcon,
        title: t('indicator_list.macd.crossdown.badge'),
        fullTitle: t('indicator_list.macd.crossdown.full_badge'),
        textColor: 'text-v1-content-notice',
        resolutions: valueAsMacd.macd_cross_down_resolutions ?? [],
      };
    }
    if (type === 'bearish_divergence') {
      return {
        icon: BearishIcon,
        title: t('common.bearish.badge'),
        fullTitle: t('common.bearish.full_badge'),
        textColor: 'text-v1-content-negative',
        resolutions: value.bearish_divergence_resolutions ?? [],
      };
    }
    if (type === 'bullish_divergence') {
      return {
        icon: BullishIcon,
        title: t('common.bullish.badge'),
        fullTitle: t('common.bullish.full_badge'),
        textColor: 'text-v1-content-positive',
        resolutions: value.bullish_divergence_resolutions ?? [],
      };
    }
    throw new Error('unexpected error');
  }, [type, t, value]);

  return (
    <div className="inline-flex flex-col items-center justify-center gap-px">
      <div className="inline-flex items-center gap-[0.3rem]">
        <DataIcon
          className={clsx(
            data.resolutions.length === 0 && 'opacity-80 contrast-0 grayscale',
          )}
        />
        <span className="inline-flex items-center gap-px">
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
          <Icon
            name={bxInfoCircle}
            size={18}
            strokeWidth={1}
            className="cursor-help"
          />
        </Tooltip>
      </div>
      <p className="text-center text-xxs text-v1-content-secondary">
        {data.title}
      </p>
    </div>
  );
}
