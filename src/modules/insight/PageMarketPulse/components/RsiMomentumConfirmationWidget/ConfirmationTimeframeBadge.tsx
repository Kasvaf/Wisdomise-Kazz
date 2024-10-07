import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  type RsiMomentumConfirmation,
  type RsiMomentumConfirmationCombination,
} from 'api/market-pulse';

const calculateTimeframe = (
  overnessResolutions: string[],
  divergenceResolutions: string[],
) => {
  const toTimeframe = (resolutions: string[]) =>
    resolutions
      .map(r =>
        r.toUpperCase() === '4H' || r.toUpperCase() === '1D' ? 'long' : 'short',
      )
      .filter((r, i, s) => s.indexOf(r) === i);
  const overs = toTimeframe(overnessResolutions);
  const divs = toTimeframe(divergenceResolutions);
  if (
    overs.length === 0 ||
    overs.length > 1 ||
    divs.length === 0 ||
    divs.length > 1
  )
    return;
  return overs[0] === divs[0] ? overs[0] : undefined;
};

export function ConfirmationTimeframeBadge({
  combination,
  value,
}: {
  combination: RsiMomentumConfirmationCombination[];
  value: RsiMomentumConfirmation;
}) {
  const { t } = useTranslation('market-pulse');
  const timeframe = calculateTimeframe(
    [
      ...(combination.includes('oversold')
        ? value.oversold_resolutions ?? []
        : []),
      ...(combination.includes('overbought')
        ? value.overbought_resolutions ?? []
        : []),
    ],
    [
      ...(combination.includes('bearish_divergence')
        ? value.bearish_divergence_resolutions ?? []
        : []),
      ...(combination.includes('bullish_divergence')
        ? value.bullish_divergence_resolutions ?? []
        : []),
    ],
  );
  if (!timeframe) return null;
  return (
    <span
      className={clsx(
        timeframe === 'long'
          ? 'bg-v1-background-positive/20 text-v1-background-positive'
          : 'bg-v1-background-accent/20 text-v1-background-accent',
        'rounded-xl p-1 px-2 text-xxs',
      )}
    >
      {timeframe === 'long' ? t('common.long_term') : t('common.short_term')}
    </span>
  );
}
