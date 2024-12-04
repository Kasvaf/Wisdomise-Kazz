import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { type FC } from 'react';
import { useSubscription } from 'api';
import { ReadableDuration } from 'shared/ReadableDuration';
import { isMiniApp } from 'utils/version';
import { useIsLoggedIn } from '../../auth/jwt-store';
import LogoBlack from './logo-black.png';
import Bg from './bg.png';

export const TrialEndBanner: FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation('pro');
  const subscription = useSubscription();
  const isLoggedIn = useIsLoggedIn();

  const show =
    !isMiniApp &&
    isLoggedIn &&
    (subscription.level === 0 || subscription.status === 'trialing');
  if (!show) return null;
  return (
    <div
      className={clsx(
        'flex flex-col items-center gap-3 mobile:flex-row ',
        'relative overflow-hidden rounded-md bg-pro-gradient p-3 text-xs mobile:h-10 mobile:rounded-none',
        className,
      )}
    >
      <div className="absolute top-8 size-24 bg-white blur-2xl mobile:-right-10 mobile:top-0 mobile:size-36 mobile:rounded-none" />
      <img
        src={Bg}
        className="absolute left-[10%] top-0 h-full w-[80%] object-cover object-center mobile:w-[50%]"
      />
      <img
        src={LogoBlack}
        className="relative -mb-3 -ms-2 w-8 shrink-0 mobile:-mb-4"
      />
      <div className="relative w-2/3 grow text-center font-medium mobile:text-start">
        <Trans
          ns="pro"
          i18nKey="expires-soon"
          components={{
            Duration: (
              <ReadableDuration
                value={subscription.remaining}
                className="font-bold"
                zeroText={t('zero-hour')}
              />
            ),
          }}
        />
      </div>
      <Link
        to="/account/billing"
        className={clsx(
          'relative flex h-8 w-full shrink-0 items-center justify-center rounded-md px-2 mobile:h-6 mobile:w-auto mobile:rounded',
          'bg-v1-background-primary text-v1-content-primary transition-all hover:brightness-125 active:brightness-90',
        )}
      >
        {t('upgrade-now')}
      </Link>
    </div>
  );
};
