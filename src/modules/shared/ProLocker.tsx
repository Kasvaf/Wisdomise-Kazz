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
  mode: 'table' | 'children' | 'badge';
  enabled?: boolean;
  level?: number;
}>) {
  const { t } = useTranslation('pro');
  const [isLoading, setIsLoading] = useState(true);
  const pro = usePro();
  const [buttonPosition, setButtonPosition] = useState<{
    top: string;
    height: string;
  }>({
    top: '0px',
    height: '100%',
  });
  const parentEl = useRef<HTMLDivElement>(null);
  const isLoggedIn = useIsLoggedIn();
  const [blockList, setBlockList] = useState<HTMLElement[]>([]);
  const shouldBlock = !pro.hasAccess && enabled !== false;

  useEffect(() => {
    if (!parentEl.current) return;
    setIsLoading(true);
    const els =
      mode === 'table'
        ? [
            ...parentEl.current.querySelectorAll(
              'tbody > tr:not([aria-hidden])',
            ),
          ]
        : parentEl.current.children;
    setBlockList(() => {
      const ret = [];
      for (const el of els) {
        if (ret.length < (level ?? 1)) ret.push(el as HTMLElement);
      }
      return ret;
    });
  }, [mode, level]);

  useEffect(() => {
    for (const el of blockList) {
      delete el.dataset.pro;
    }
    if (!shouldBlock) return;
    for (const el of blockList) {
      el.dataset.pro = mode;
    }
  }, [blockList, mode, shouldBlock]);

  useEffect(() => {
    const top = Math.min(...blockList.map(r => r.offsetTop));
    const bottom = Math.max(
      ...blockList.map(r => r.offsetHeight + r.offsetTop),
    );
    setButtonPosition({
      top: `${top}px`,
      height: `${bottom - top}px`,
    });
    setIsLoading(false);
  }, [blockList]);

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
        {blockList.length > 0 && shouldBlock && (
          <div
            className={clsx(
              'absolute left-0 z-10 flex w-full cursor-pointer flex-col gap-2 text-base font-medium',
              'group transition-all',
              mode === 'badge'
                ? 'items-end justify-start'
                : 'items-center justify-center backdrop-blur-sm',
            )}
            style={{
              ...buttonPosition,
            }}
            onClick={pro.handleClick}
          >
            <b
              className={clsx(
                mode === 'badge' ? '-m-4 h-auto' : 'h-auto w-auto',
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
