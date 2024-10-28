import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { OverviewWidget } from 'shared/OverviewWidget';
import Light from './light.png';
import BgDesktop from './bg-desktop.png';
import BgMobile from './bg-mobile.png';
import { ReactComponent as RealtimeIcon } from './realtime.svg';

export function SocialRadarBannerWidget({ className }: { className?: string }) {
  const { t } = useTranslation('coin-radar');
  return (
    <OverviewWidget
      className={clsx(
        'h-[165px] bg-gradient-to-r from-v1-surface-l3 to-v1-surface-l2 !p-0 mobile:h-auto',
        className,
      )}
      contentClassName="relative !p-6 mobile:!p-0 md:!p-10 !m-0 flex justify-between items-center gap-6 mobile:flex-col"
    >
      <div className="absolute inset-0 size-full p-4 mobile:relative">
        <img
          src={Light}
          className="absolute bottom-0 right-0 h-full w-full object-cover md:w-auto"
        />
        <img
          src={BgDesktop}
          className="absolute bottom-0 right-0 h-full w-auto object-cover opacity-100 mobile:hidden"
        />
        <img src={BgMobile} className="relative hidden mobile:block" />
      </div>
      <div className="relative bottom-0 space-y-2 mobile:absolute mobile:p-6">
        <h1 className="flex items-center gap-2 text-xl font-medium text-v1-content-primary mobile:flex-col-reverse mobile:justify-center mobile:gap-3 mobile:text-base">
          {t('hot-coins-banner.title')}
          <RealtimeIcon className="animate-pulse" />
        </h1>
        <p className="text-base text-v1-content-secondary mobile:text-xs mobile:text-v1-content-primary/70">
          {t('hot-coins-banner.subtitle')}
        </p>
      </div>
    </OverviewWidget>
  );
}
