import { clsx } from 'clsx';
import { type FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useMarketInfoFromSignals } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import { DekstopBanner, MobileBanner } from './assets';

export const HotCoinsBanner: FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation('social-radar');
  const marketInfo = useMarketInfoFromSignals();
  return (
    <div className={clsx('relative overflow-hidden rounded-xl', className)}>
      <img
        src={DekstopBanner}
        className="col-span-full h-auto min-h-44 w-full object-cover mobile:hidden"
      />
      <img
        src={MobileBanner}
        className="col-span-full hidden h-64 w-full object-cover object-bottom mobile:block"
      />
      <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-2 p-11 text-center mobile:justify-start">
        <p className="max-w-xs text-lg font-medium">
          {t('market-info.description')}
        </p>
        <Trans ns="social-radar" i18nKey="market-info.social-channel-count">
          <p className="max-w-md text-sm text-white/60">
            Wisdomise Social Radar Scanned{' '}
            <ReadableNumber
              className="font-semibold text-white"
              value={marketInfo.data?.total_channels || 0}
            />
            Social Accounts in the Past 24 Hours.
          </p>
        </Trans>
      </div>
    </div>
  );
};
