import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import {
  type Indicator,
  type IndicatorConfirmation,
  type IndicatorConfirmationCombination,
} from 'api/market-pulse';

const calculateTimeBadge = (resolutionsList: string[][]) => {
  const badgedResolutionsList = resolutionsList.map(resolutions =>
    resolutions
      .map(r =>
        r.toUpperCase() === '4H' || r.toUpperCase() === '1D' ? 'long' : 'short',
      )
      .filter((r, i, s) => s.indexOf(r) === i),
  );
  if (
    badgedResolutionsList.every(
      badgedResolutions => badgedResolutions.length === 1,
    )
  ) {
    const returnValue: undefined | 'long' | 'short' =
      badgedResolutionsList[0][0];
    const badgeConfirm = badgedResolutionsList.every(
      badgedResolutions => badgedResolutions[0] === returnValue,
    );
    if (badgeConfirm) {
      return returnValue;
    }
  }
};

export function ConfirmationTimeframeBadge<I extends Indicator>({
  combination,
  value,
}: {
  combination: Array<IndicatorConfirmationCombination<I>>;
  value: IndicatorConfirmation<I>;
}) {
  const { t } = useTranslation('market-pulse');

  const timeBadge = useMemo(() => {
    const valueAsRsi = value as IndicatorConfirmation<'rsi'>;
    const valueAsMacd = value as IndicatorConfirmation<'macd'>;
    let resolutionsList: string[][] = [];
    for (const comb of combination) {
      const combAsRsi = comb as IndicatorConfirmationCombination<'rsi'>;
      const combAsMacd = comb as IndicatorConfirmationCombination<'macd'>;
      if (combAsRsi === 'oversold') {
        resolutionsList = [
          ...resolutionsList,
          valueAsRsi.oversold_resolutions ?? [],
        ];
      }
      if (combAsRsi === 'overbought') {
        resolutionsList = [
          ...resolutionsList,
          valueAsRsi.overbought_resolutions ?? [],
        ];
      }
      if (combAsMacd === 'macd_cross_up') {
        resolutionsList = [
          ...resolutionsList,
          valueAsMacd.macd_cross_up_resolutions ?? [],
        ];
      }
      if (combAsMacd === 'macd_cross_down') {
        resolutionsList = [
          ...resolutionsList,
          valueAsMacd.macd_cross_down_resolutions ?? [],
        ];
      }
      //
      if (combAsRsi === 'bearish_divergence') {
        resolutionsList = [
          ...resolutionsList,
          valueAsRsi.bearish_divergence_resolutions ?? [],
        ];
      }
      if (combAsRsi === 'bullish_divergence') {
        resolutionsList = [
          ...resolutionsList,
          valueAsRsi.bullish_divergence_resolutions ?? [],
        ];
      }
    }
    return calculateTimeBadge(resolutionsList);
  }, [value, combination]);

  if (!timeBadge) return null;
  return (
    <span
      className={clsx(
        timeBadge === 'long'
          ? 'bg-v1-background-positive/20 text-v1-background-positive'
          : 'bg-v1-background-accent/20 text-v1-background-accent',
        'rounded-xl p-1 px-2 text-xxs',
      )}
    >
      {timeBadge === 'long' ? t('common.long_term') : t('common.short_term')}
    </span>
  );
}
