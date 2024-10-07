import { useTranslation } from 'react-i18next';
import { type RsiMomentumConfirmationCombination } from 'api/market-pulse';

export type ConfirmationType = 'bullish' | 'bearish';

export interface ConfirmationSubTab {
  combination: RsiMomentumConfirmationCombination[];
  key: string;
  title: string;
}

export const useConfirmationTabs = (
  type: ConfirmationType,
): ConfirmationSubTab[] => {
  const { t } = useTranslation('market-pulse');
  return type === 'bullish'
    ? [
        {
          title: t('indicator_list.rsi.momentum.oversold.title'),
          combination: ['oversold'],
          key: 'oversold',
        },
        {
          title: t('indicator_list.rsi.momentum.bullish.title'),
          combination: ['bullish_divergence'],
          key: 'bullish',
        },
        {
          title: t('indicator_list.rsi.momentum.oversold_bullish.title'),
          combination: ['oversold', 'bullish_divergence'],
          key: 'oversold_bullish',
        },
      ]
    : [
        {
          title: t('indicator_list.rsi.momentum.overbought.title'),
          combination: ['overbought'],
          key: 'overbought',
        },
        {
          title: t('indicator_list.rsi.momentum.bearish.title'),
          combination: ['bearish_divergence'],
          key: 'bearish',
        },
        {
          title: t('indicator_list.rsi.momentum.overbought_bearish.title'),
          combination: ['overbought', 'bearish_divergence'],
          key: 'overbought_bearish',
        },
      ];
};
