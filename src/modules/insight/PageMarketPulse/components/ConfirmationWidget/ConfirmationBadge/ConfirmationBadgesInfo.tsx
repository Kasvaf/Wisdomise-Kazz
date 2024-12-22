import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as OversoldIcon } from './oversold.svg';
import { ReactComponent as OverboughtIcon } from './overbought.svg';
import { ReactComponent as BearishIcon } from './bearish.svg';
import { ReactComponent as BullishIcon } from './bullish.svg';
import { ReactComponent as CrossUp } from './crossup.svg';
import { ReactComponent as CrossDown } from './crossdown.svg';

export const ConfirmationBadgesInfo: FC = () => {
  const { t } = useTranslation('market-pulse');
  // ('~NAITODO');
  const infos: Array<{
    icon: typeof OversoldIcon;
    title: string;
    description: string;
  }> = [
    {
      icon: OversoldIcon,
      title: t('keywords.rsi_oversold.label_exact'),
      description: t('keywords.rsi_oversold.info'),
    },
    {
      icon: OverboughtIcon,
      title: t('keywords.rsi_overbought.label_exact'),
      description: t('keywords.rsi_overbought.info'),
    },
    {
      icon: BullishIcon,
      title: t('keywords.rsi_macd_bullish.label_exact'),
      description: t('keywords.rsi_macd_bullish.info'),
    },
    {
      icon: BearishIcon,
      title: t('keywords.rsi_macd_bearish.label_exact'),
      description: t('keywords.rsi_macd_bearish.info'),
    },
    {
      icon: CrossUp,
      title: t('keywords.macd_cross_up.label_exact'),
      description: t('keywords.macd_cross_up.info'),
    },
    {
      icon: CrossDown,
      title: t('keywords.macd_cross_down.label_exact'),
      description: t('keywords.macd_cross_down.info'),
    },
  ];
  return (
    <div className="space-y-5">
      {infos.map(({ icon: InfoIcon, ...info }) => (
        <div key={info.title} className="flex items-start gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-v1-surface-l1">
            <InfoIcon className="size-5" />
          </div>
          <div>
            <h4 className="mb-[2px] font-medium text-v1-content-primary">
              {info.title}
            </h4>
            <p className="text-xs font-normal text-v1-content-secondary">
              {info.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
