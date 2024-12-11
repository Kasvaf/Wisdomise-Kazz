import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import {
  type IndicatorConfirmationCombination,
  type Indicator,
} from 'api/market-pulse';

export type ConfirmationType = 'bullish' | 'bearish';

export interface ConfirmationSubTab {
  combination: IndicatorConfirmationCombination[];
  key: string;
  title: string;
}

export const useConfirmationTabs = <I extends Indicator>(
  indicator: I,
  type: ConfirmationType,
): ConfirmationSubTab[] => {
  const { t } = useTranslation('market-pulse');

  return useMemo(() => {
    let returnValue: ConfirmationSubTab[] = [];
    if (indicator === 'rsi') {
      returnValue = (
        type === 'bullish'
          ? [
              {
                title: t('indicator_list.rsi.oversold_bullish.title'),
                combination: ['rsi_oversold', 'rsi_bullish_divergence'],
                key: 'rsi_oversold_bullish',
              },
              {
                title: t('indicator_list.rsi.oversold.title'),
                combination: ['rsi_oversold'],
                key: 'rsi_oversold',
              },
              {
                title: t('common.bullish.title'),
                combination: ['rsi_bullish_divergence'],
                key: 'rsi_bullish',
              },
            ]
          : [
              {
                title: t('indicator_list.rsi.overbought_bearish.title'),
                combination: ['overbought', 'bearish_divergence'],
                key: 'overbought_bearish',
              },
              {
                title: t('indicator_list.rsi.overbought.title'),
                combination: ['overbought'],
                key: 'overbought',
              },
              {
                title: t('common.bearish.title'),
                combination: ['bearish_divergence'],
                key: 'bearish',
              },
            ]
      ) as ConfirmationSubTab[];
    } else if (indicator === 'macd') {
      returnValue = (
        type === 'bullish'
          ? [
              {
                title: t('indicator_list.macd.crossup.title'),
                combination: ['macd_cross_up'],
                key: 'macd_crossup',
              },
              {
                title: t('common.bullish.title'),
                combination: ['macd_bullish_divergence'],
                key: 'macd_bullish',
              },
              {
                title: t('indicator_list.macd.crossup_bullish.title'),
                combination: ['macd_cross_up', 'macd_bullish_divergence'],
                key: 'macd_crossup_bullish',
              },
            ]
          : [
              {
                title: t('indicator_list.macd.crossdown.title'),
                combination: ['macd_cross_down'],
                key: 'macd_crossdown',
              },
              {
                title: t('common.bearish.title'),
                combination: ['macd_bearish_divergence'],
                key: 'macd_bearish',
              },
              {
                title: t('indicator_list.macd.crossdown_bearish.title'),
                combination: ['macd_cross_down', 'macd_bearish_divergence'],
                key: 'macd_crossdown_bearish',
              },
            ]
      ) as ConfirmationSubTab[];
    }
    return returnValue;
  }, [indicator, type, t]);
};
