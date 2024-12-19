import { type FC, type SVGProps, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import {
  type Indicator,
  type IndicatorConfirmationCombination,
  type IndicatorConfirmation,
} from 'api/market-pulse';
import { HoverTooltip } from 'shared/HoverTooltip';
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
            className="inline-flex items-center justify-center rounded bg-v1-surface-l1 px-2 py-px text-xxs font-medium"
          >
            {row.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConfirmationBadge<I extends Indicator>({
  type,
  value,
  mini,
}: {
  type: IndicatorConfirmationCombination;
  value: IndicatorConfirmation<I>;
  mini?: boolean;
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
        ...Object.keys(
          (value as IndicatorConfirmation<'rsi'>).rsi_divergence_types ?? {},
        ),
        ...Object.keys(
          (value as IndicatorConfirmation<'macd'>).macd_divergence_types ?? {},
        ),
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
    const valueAsRsi = value as IndicatorConfirmation<'rsi'>;
    const valueAsMacd = value as IndicatorConfirmation<'macd'>;
    if (type === 'rsi_oversold') {
      return {
        icon: OversoldIcon,
        title: t('keywords.rsi_oversold.label_small'),
        fullTitle: t('keywords.rsi_oversold.label_exact'),
        textColor: 'text-v1-content-brand',
        resolutions: valueAsRsi.rsi_oversold_resolutions ?? [],
      };
    }
    if (type === 'rsi_overbought') {
      return {
        icon: OverboughtIcon,
        title: t('keywords.rsi_overbought.label_small'),
        fullTitle: t('keywords.rsi_overbought.label_exact'),
        textColor: 'text-v1-content-notice',
        resolutions: valueAsRsi.rsi_overbought_resolutions ?? [],
      };
    }
    if (type === 'macd_cross_up') {
      return {
        icon: CrossupIcon,
        title: t('keywords.macd_cross_up.label_small'),
        fullTitle: t('keywords.macd_cross_up.label_exact'),
        textColor: 'text-v1-content-brand',
        resolutions: valueAsMacd.macd_cross_up_resolutions ?? [],
      };
    }
    if (type === 'macd_cross_down') {
      return {
        icon: CrossdownIcon,
        title: t('keywords.macd_cross_down.label_small'),
        fullTitle: t('keywords.macd_cross_down.label_exact'),
        textColor: 'text-v1-content-notice',
        resolutions: valueAsMacd.macd_cross_down_resolutions ?? [],
      };
    }
    if (
      type === 'rsi_bearish_divergence' ||
      type === 'macd_bearish_divergence'
    ) {
      return {
        icon: BearishIcon,
        title:
          type === 'rsi_bearish_divergence'
            ? t('keywords.rsi_bearish.label_small')
            : t('keywords.macd_bearish.label_small'),
        fullTitle:
          type === 'rsi_bearish_divergence'
            ? t('keywords.rsi_bearish.label_exact')
            : t('keywords.macd_bearish.label_exact'),
        textColor: 'text-v1-content-negative',
        resolutions:
          valueAsRsi.rsi_bearish_divergence_resolutions ??
          valueAsMacd.macd_bearish_divergence_resolutions ??
          [],
      };
    }
    if (
      type === 'rsi_bullish_divergence' ||
      type === 'macd_bullish_divergence'
    ) {
      return {
        icon: BullishIcon,
        title:
          type === 'rsi_bullish_divergence'
            ? t('keywords.rsi_bullish.label_small')
            : t('keywords.macd_bullish.label_small'),
        fullTitle:
          type === 'rsi_bullish_divergence'
            ? t('keywords.rsi_bullish.label_exact')
            : t('keywords.macd_bullish.label_exact'),
        textColor: 'text-v1-content-positive',
        resolutions:
          valueAsRsi.rsi_bullish_divergence_resolutions ??
          valueAsMacd.macd_bullish_divergence_resolutions ??
          [],
      };
    }
    throw new Error('unexpected error');
  }, [type, t, value]);

  return (
    <HoverTooltip
      title={
        <div>
          <p className="mb-1 text-xs text-v1-content-primary">
            {data.fullTitle}
          </p>
          <ConfirmationResolutionRow value={data.resolutions} />
        </div>
      }
    >
      <div className="inline-flex cursor-default flex-col items-start justify-center gap-px">
        <div className="inline-flex items-center gap-[2px]">
          <DataIcon
            className={clsx(
              data.resolutions.length === 0 &&
                'opacity-80 contrast-0 grayscale',
              'w-5',
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
        </div>
        {!mini && (
          <p className="whitespace-nowrap text-start text-xxs text-v1-content-secondary">
            {data.title}
          </p>
        )}
      </div>
    </HoverTooltip>
  );
}
