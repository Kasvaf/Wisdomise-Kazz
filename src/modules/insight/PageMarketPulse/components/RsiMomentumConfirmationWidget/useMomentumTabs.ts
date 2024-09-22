import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'usehooks-ts';
import { type RsiMomentumConbination } from 'api/market-pulse';

export type MomentumType = 'bullish' | 'bearish';

export interface MomentumSubTab {
  combination: RsiMomentumConbination[];
  key: string;
  title: string;
  description: string;
}

export const useMomentumTabs = (type: MomentumType): MomentumSubTab[] => {
  const { t } = useTranslation('market-pulse');
  const isSmallDevice = useMediaQuery('(max-width: 1536px)');
  return type === 'bullish'
    ? [
        {
          title: t('indicator_list.rsi.momentum.oversold_bullish.title'),
          description: t(
            'indicator_list.rsi.momentum.oversold_bullish.description',
          ),
          combination: ['oversold', 'bullish_divergence'],
          key: 'oversold_bullish',
        },
        {
          title: t('indicator_list.rsi.momentum.oversold.title'),
          description: t('indicator_list.rsi.momentum.oversold.description'),
          combination: ['oversold'],
          key: 'oversold',
        },
        {
          title: isSmallDevice
            ? t('indicator_list.rsi.bullish')
            : t('indicator_list.rsi.momentum.bullish.title'),
          description: t('indicator_list.rsi.momentum.bullish.description'),
          combination: ['bullish_divergence'],
          key: 'bullish',
        },
      ]
    : [
        {
          title: t('indicator_list.rsi.momentum.overbought_bearish.title'),
          description: t(
            'indicator_list.rsi.momentum.overbought_bearish.description',
          ),
          combination: ['overbought', 'bearish_divergence'],
          key: 'overbought_bearish',
        },
        {
          title: t('indicator_list.rsi.momentum.overbought.title'),
          description: t('indicator_list.rsi.momentum.overbought.description'),
          combination: ['overbought'],
          key: 'overbought',
        },
        {
          title: isSmallDevice
            ? t('indicator_list.rsi.bearish')
            : t('indicator_list.rsi.momentum.bearish.title'),
          description: t('indicator_list.rsi.momentum.bearish.description'),
          combination: ['bearish_divergence'],
          key: 'bearish',
        },
      ];
};
