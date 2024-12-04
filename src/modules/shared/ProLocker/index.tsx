import { clsx } from 'clsx';
import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useInterval } from 'usehooks-ts';
import { usePro } from 'modules/base/auth/ProContent/ProProvider';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useSubscription } from 'api';
import { ReactComponent as Logo } from './logo.svg';
import { ReactComponent as Sparkle } from './sparkle.svg';

export function ProLocker({
  children,
  className,
  mode,
  enabled,
  size = 1,
  level = 1,
}: PropsWithChildren<{
  className?: string;
  mode: 'table' | 'children';
  enabled?: boolean;
  size?: number;
  level?: number;
}>) {
  const { t } = useTranslation('pro');
  const [isLoading, setIsLoading] = useState(true);
  const pro = usePro();
  const subscription = useSubscription();
  const [buttonPosition, setButtonPosition] = useState<{
    top: string;
    height: string;
    active: boolean;
  }>({
    top: '0px',
    height: '150px',
    active: false,
  });
  const parentEl = useRef<HTMLDivElement>(null);
  const isLoggedIn = useIsLoggedIn();
  const [tick, setTick] = useState(0);

  useInterval(() => setTick(p => p + 1), 1000);

  useEffect(() => setTick(p => p + 1), [children]);

  useEffect(() => {
    if (!parentEl.current || tick < 0) return;
    try {
      setIsLoading(true);
      const blockList = (
        mode === 'table'
          ? [
              ...parentEl.current.querySelectorAll(
                'tbody > tr:not([aria-hidden]):not(.ant-table-placeholder)',
              ),
            ]
          : [
              ...parentEl.current.querySelectorAll(
                '*:not([aria-hidden]):not([data-pro-locker])',
              ),
            ].filter(r => r.parentElement === parentEl.current)
      ).slice(0, size) as HTMLElement[];
      const top = Math.min(...blockList.map(r => r.offsetTop ?? 0));
      const bottom = Math.max(
        ...blockList.map(r => (r.offsetHeight ?? 0) + (r.offsetTop ?? 0)),
      );
      setButtonPosition({
        top: `${top}px`,
        height: `${bottom - top}px`,
        active: blockList.length > 0,
      });
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, [mode, size, tick]);

  return (
    <>
      <div
        ref={parentEl}
        className={clsx(
          'relative',
          isLoading && 'animate-pulse blur-sm',
          className,
        )}
      >
        {children}
        {buttonPosition.active &&
          (subscription.level < level || !isLoggedIn) &&
          enabled !== false && (
            <div
              className={clsx(
                'absolute left-0 z-[2] min-h-[132px] w-full gap-2 rounded-xl px-4 py-1',
                'flex flex-col items-center justify-center backdrop-blur',
                'overflow-hidden bg-[rgba(29,38,47,0.2)]',
              )}
              style={{
                ...buttonPosition,
              }}
              data-pro-locker
            >
              <div className="relative inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-v1-surface-l1">
                <Logo />
              </div>
              <p className="text-center text-xs capitalize text-v1-content-primary">
                {isLoggedIn
                  ? level === 2
                    ? t('pro-locker.proplus.message')
                    : t('pro-locker.pro.message')
                  : t('pro-locker.login.message')}
              </p>
              <button
                onClick={() => pro.ensureHasLevel(level)}
                className={clsx(
                  'inline-flex h-9 w-auto shrink-0 items-center gap-1',
                  'rounded-lg bg-pro-gradient px-4 text-xs font-medium text-black',
                  'transition-all hover:brightness-110',
                )}
              >
                <Sparkle />
                {isLoggedIn
                  ? level === 2
                    ? t('pro-locker.proplus.button')
                    : t('pro-locker.pro.button')
                  : t('pro-locker.login.button')}
              </button>
            </div>
          )}
      </div>
    </>
  );
}
