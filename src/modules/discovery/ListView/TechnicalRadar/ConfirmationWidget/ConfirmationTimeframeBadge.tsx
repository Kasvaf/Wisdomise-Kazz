import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import {
  type Indicator,
  type IndicatorConfirmation,
  type IndicatorConfirmationCombination,
} from 'api/discovery';

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
  combination: IndicatorConfirmationCombination[];
  value: IndicatorConfirmation<I>;
}) {
  const { t } = useTranslation('market-pulse');

  const timeBadge = useMemo(() => {
    let resolutionsList: string[][] = [];
    for (const comb of combination) {
      resolutionsList = [
        ...resolutionsList,
        (value[`${comb}_resolutions` as keyof typeof value] as string[]) ?? [],
      ];
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
        'inline-flex h-4 items-center justify-center rounded-xl px-2 text-[9px]',
      )}
    >
      {timeBadge === 'long' ? t('common.long_term') : t('common.short_term')}
    </span>
  );
}
