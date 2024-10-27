import { clsx } from 'clsx';
import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { usePro } from 'modules/base/auth/ProContent/ProProvider';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';

export function ProLocker({
  children,
  className,
  mode,
  enabled,
  level,
}: PropsWithChildren<{
  className?: string;
  mode: 'table' | 'children';
  enabled?: boolean;
  level?: number;
}>) {
  const { t } = useTranslation('pro');
  const [isLoading, setIsLoading] = useState(true);
  const pro = usePro();
  const [buttonPosition, setButtonPosition] = useState<{
    top: string;
    height: string;
    active: boolean;
  }>({
    top: '0px',
    height: '100%',
    active: false,
  });
  const parentEl = useRef<HTMLDivElement>(null);
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (!parentEl.current) return;
    setIsLoading(true);
    const blockList = (
      mode === 'table'
        ? [
            ...parentEl.current.querySelectorAll(
              'tbody > tr:not([aria-hidden]):not(.ant-table-placeholder)',
            ),
          ]
        : [...parentEl.current.querySelectorAll('& > *:not([aria-hidden])')]
    ).slice(0, level ?? 1) as HTMLElement[];
    const top = Math.min(...blockList.map(r => r.offsetTop ?? 0));
    const bottom = Math.max(
      ...blockList.map(r => (r.offsetHeight ?? 0) + (r.offsetTop ?? 0)),
    );
    setButtonPosition({
      top: `${top}px`,
      height: `${bottom - top}px`,
      active: blockList.length > 0,
    });
    setIsLoading(false);
  }, [mode, level]);

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
        {buttonPosition.active && !pro.hasAccess && enabled !== false && (
          <div
            className={clsx(
              'absolute left-0 z-[2] flex w-full cursor-pointer flex-col gap-2 text-base font-medium',
              'group transition-all',
              'items-center justify-center backdrop-blur-sm',
            )}
            style={{
              ...buttonPosition,
            }}
            onClick={pro.ensureIsPro}
          >
            <b
              className={clsx(
                'h-auto w-auto',
                'rounded-lg bg-pro-gradient px-3 py-1 text-xs font-medium text-black shadow-xl',
                'group-hover:brightness-110',
              )}
            >
              {isLoggedIn ? t('unlock-with-pro') : t('login-required')}
            </b>
          </div>
        )}
      </div>
    </>
  );
}
