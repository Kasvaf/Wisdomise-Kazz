import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import {
  type Indicator,
  type IndicatorConfirmation,
  type IndicatorConfirmationCombination,
} from 'api/market-pulse';

const calculateTimeframe = (
  indicatorResolutions: string[],
  divergenceResolutions: string[],
) => {
  const toTimeframe = (resolutions: string[]) =>
    resolutions
      .map(r =>
        r.toUpperCase() === '4H' || r.toUpperCase() === '1D' ? 'long' : 'short',
      )
      .filter((r, i, s) => s.indexOf(r) === i);
  const inds = toTimeframe(indicatorResolutions);
  const divs = toTimeframe(divergenceResolutions);
  if (
    inds.length === 0 ||
    inds.length > 1 ||
    divs.length === 0 ||
    divs.length > 1
  )
    return;
  return inds[0] === divs[0] ? inds[0] : undefined;
};

export function ConfirmationTimeframeBadge<I extends Indicator>({
  indicator,
  combination,
  value,
}: {
  indicator: I;
  combination: Array<IndicatorConfirmationCombination<I>>;
  value: IndicatorConfirmation<I>;
}) {
  const { t } = useTranslation('market-pulse');

  const timeFrame = useMemo(() => {
    if (indicator === 'rsi') {
      const valueAsRsi = value as IndicatorConfirmation<'rsi'>;
      const combinationAsRsi = combination as Array<
        IndicatorConfirmationCombination<'rsi'>
      >;
      return calculateTimeframe(
        [
          ...(combinationAsRsi.includes('oversold')
            ? valueAsRsi.oversold_resolutions ?? []
            : []),
          ...(combinationAsRsi.includes('overbought')
            ? valueAsRsi.overbought_resolutions ?? []
            : []),
        ],
        [
          ...(combinationAsRsi.includes('bearish_divergence')
            ? valueAsRsi.bearish_divergence_resolutions ?? []
            : []),
          ...(combinationAsRsi.includes('bullish_divergence')
            ? valueAsRsi.bullish_divergence_resolutions ?? []
            : []),
        ],
      );
    } else if (indicator === 'macd') {
      const valueAsMacd = value as IndicatorConfirmation<'macd'>;
      const combinationAsMacd = combination as Array<
        IndicatorConfirmationCombination<'macd'>
      >;
      return calculateTimeframe(
        [
          ...(combinationAsMacd.includes('macd_cross_up')
            ? valueAsMacd.macd_cross_up_resolutions ?? []
            : []),
          ...(combinationAsMacd.includes('macd_cross_down')
            ? valueAsMacd.macd_cross_down_resolutions ?? []
            : []),
        ],
        [
          ...(combinationAsMacd.includes('bearish_divergence')
            ? valueAsMacd.bearish_divergence_resolutions ?? []
            : []),
          ...(combinationAsMacd.includes('bullish_divergence')
            ? valueAsMacd.bullish_divergence_resolutions ?? []
            : []),
        ],
      );
    }
  }, [value, indicator, combination]);

  if (!timeFrame) return null;
  return (
    <span
      className={clsx(
        timeFrame === 'long'
          ? 'bg-v1-background-positive/20 text-v1-background-positive'
          : 'bg-v1-background-accent/20 text-v1-background-accent',
        'rounded-xl p-1 px-2 text-xxs',
      )}
    >
      {timeFrame === 'long' ? t('common.long_term') : t('common.short_term')}
    </span>
  );
}
