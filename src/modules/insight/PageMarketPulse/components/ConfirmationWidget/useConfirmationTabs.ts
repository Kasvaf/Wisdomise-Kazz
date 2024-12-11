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
                title: `${t('keywords.rsi_oversold.label_equiv')} & ${t(
                  'keywords.rsi_bullish.label_equiv',
                )}`,
                combination: ['rsi_oversold', 'rsi_bullish_divergence'],
                key: 'rsi_oversold_bullish',
              },
              {
                title: t('keywords.rsi_oversold.label_equiv'),
                combination: ['rsi_oversold'],
                key: 'rsi_oversold',
              },
              {
                title: t('keywords.rsi_bullish.label_equiv'),
                combination: ['rsi_bullish_divergence'],
                key: 'rsi_bullish',
              },
            ]
          : [
              {
                title: `${t('keywords.rsi_overbought.label_equiv')} & ${t(
                  'keywords.rsi_bearish.label_equiv',
                )}`,
                combination: ['overbought', 'bearish_divergence'],
                key: 'overbought_bearish',
              },
              {
                title: t('keywords.rsi_overbought.label_equiv'),
                combination: ['overbought'],
                key: 'overbought',
              },
              {
                title: t('keywords.rsi_bearish.label_equiv'),
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
                title: t('keywords.macd_cross_up.label_equiv'),
                combination: ['macd_cross_up'],
                key: 'macd_crossup',
              },
              {
                title: t('keywords.macd_bullish.label_equiv'),
                combination: ['macd_bullish_divergence'],
                key: 'macd_bullish',
              },
              {
                title: `${t('keywords.macd_cross_up.label_equiv')} & ${t(
                  'keywords.macd_bullish.label_equiv',
                )}`,
                combination: ['macd_cross_up', 'macd_bullish_divergence'],
                key: 'macd_crossup_bullish',
              },
            ]
          : [
              {
                title: t('keywords.macd_cross_down.label_equiv'),
                combination: ['macd_cross_down'],
                key: 'macd_crossdown',
              },
              {
                title: t('keywords.macd_bearish.label_equiv'),
                combination: ['macd_bearish_divergence'],
                key: 'macd_bearish',
              },
              {
                title: `${t('keywords.macd_cross_down.label_equiv')} & ${t(
                  'keywords.macd_bearish.label_equiv',
                )}`,
                combination: ['macd_cross_down', 'macd_bearish_divergence'],
                key: 'macd_crossdown_bearish',
              },
            ]
      ) as ConfirmationSubTab[];
    }
    return returnValue;
  }, [indicator, type, t]);
};
