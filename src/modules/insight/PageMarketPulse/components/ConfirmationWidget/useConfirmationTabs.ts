import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import {
  type IndicatorConfirmationCombination,
  type Indicator,
} from 'api/market-pulse';

export type ConfirmationType = 'bullish' | 'bearish';

export interface ConfirmationSubTab<I extends Indicator> {
  combination: Array<IndicatorConfirmationCombination<I>>;
  key: string;
  title: string;
}

export const useConfirmationTabs = <I extends Indicator>(
  indicator: I,
  type: ConfirmationType,
): Array<ConfirmationSubTab<I>> => {
  const { t } = useTranslation('market-pulse');

  return useMemo(() => {
    let returnValue: Array<ConfirmationSubTab<I>> = [];
    if (indicator === 'rsi') {
      returnValue = (
        type === 'bullish'
          ? [
              {
                title: t('indicator_list.rsi.oversold_bullish.title'),
                combination: ['oversold', 'bullish_divergence'],
                key: 'oversold_bullish',
              },
              {
                title: t('indicator_list.rsi.oversold.title'),
                combination: ['oversold'],
                key: 'oversold',
              },
              {
                title: t('common.bullish.title'),
                combination: ['bullish_divergence'],
                key: 'bullish',
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
      ) as Array<ConfirmationSubTab<I>>;
    } else if (indicator === 'macd') {
      returnValue = (
        type === 'bullish'
          ? [
              {
                title: t('indicator_list.macd.crossup.title'),
                combination: ['macd_cross_up'],
                key: 'crossup',
              },
              {
                title: t('common.bullish.title'),
                combination: ['bullish_divergence'],
                key: 'bullish',
              },
              {
                title: t('indicator_list.macd.crossup_bullish.title'),
                combination: ['macd_cross_up', 'bullish_divergence'],
                key: 'crossup_bullish',
              },
            ]
          : [
              {
                title: t('indicator_list.macd.crossdown.title'),
                combination: ['macd_cross_down'],
                key: 'crossdown',
              },
              {
                title: t('common.bearish.title'),
                combination: ['bearish_divergence'],
                key: 'bearish',
              },
              {
                title: t('indicator_list.macd.crossdown_bearish.title'),
                combination: ['macd_cross_down', 'bearish_divergence'],
                key: 'crossdown_bearish',
              },
            ]
      ) as Array<ConfirmationSubTab<I>>;
    }
    return returnValue;
  }, [indicator, type, t]);
};
