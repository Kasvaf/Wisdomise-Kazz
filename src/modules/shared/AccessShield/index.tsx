import { clsx } from 'clsx';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useInterval } from 'usehooks-ts';
import { type UserGroup, useSubscription } from 'api';
import { isDebugMode } from 'utils/version';
import { HoverTooltip } from 'shared/HoverTooltip';
import { ReactComponent as Logo } from './logo.svg';
import { ReactComponent as Sparkle } from './sparkle.svg';

const calcSize = (size: number | boolean) =>
  size === true ? 999 : size === false ? 0 : size < 1 ? 0 : size;

const useShield = (mode: 'table' | 'children', size: number | boolean) => {
  const root = useRef<HTMLDivElement>(null);
  const shield = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [height, setHeight] = useState(150);

  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateStyle = useCallback(() => {
    if (timeout.current !== null) clearTimeout(timeout.current);
    if (!root.current) return;
    timeout.current = setTimeout(() => {
      try {
        if (!root.current || !shield.current) return;
        const blockList = (
          mode === 'table'
            ? [
                ...root.current.querySelectorAll(
                  'tbody > tr:not([aria-hidden]):not(.ant-table-placeholder)',
                ),
              ]
            : [
                ...root.current.querySelectorAll(
                  '*:not([aria-hidden]):not([data-pro-locker])',
                ),
              ].filter(r => r.parentElement === root.current)
        ).slice(0, calcSize(size)) as HTMLElement[];
        const isActive = blockList.length > 0;
        if (!isActive) {
          shield.current.style.display = 'none';
          root.current.style.overflow = '';
        }

        const top = Math.min(...blockList.map(r => r.offsetTop ?? 0));
        const bottom = Math.max(
          ...blockList.map(r => (r.offsetHeight ?? 0) + (r.offsetTop ?? 0)),
        );
        const minHeight = 40;
        root.current.setAttribute('size', size.toString());
        root.current.style.overflow = size === true ? 'hidden' : '';
        root.current.style.maxHeight = size === true ? '100%' : '';
        root.current.style.position = 'relative';
        shield.current.style.maxHeight = `${Math.max(
          minHeight,
          root.current.offsetHeight,
        )}px`;
        // shield.current.style.minHeight = `${minHeight}px`;
        shield.current.style.top = `${top}px`;
        shield.current.style.left = '0px';
        shield.current.style.width = '100%';
        shield.current.style.height = `${bottom - top}px`;
        shield.current.style.overflow = 'hidden';
        shield.current.style.position = 'absolute';
        shield.current.style.margin = '0';
        shield.current.style.display = '';
        shield.current.style.willChange = 'height';
        setHeight(bottom - top);
      } catch {
      } finally {
        setIsReady(true);
      }
    }, 50);
  }, [mode, size]);

  useInterval(() => updateStyle(), 500);

  return { root, shield, isReady, height };
};

export function AccessShield({
  children,
  className,
  mode,
  sizes,
}: PropsWithChildren<{
  className?: string;
  mode: 'table' | 'children';
  sizes: Record<UserGroup, number | boolean>;
}>) {
  const { t } = useTranslation('pro');
  const { ensureGroup, group, loginModal } = useSubscription();

  const size = sizes[group];

  const nextGroup = useMemo<UserGroup | undefined>(() => {
    const sizeNumber = calcSize(size);
    if (sizeNumber === 0) return;
    const groups: UserGroup[] = [
      'guest',
      'trial',
      'free',
      'pro',
      'pro+',
      'pro_max',
    ];
    const allowdGroup = groups.find(x => calcSize(sizes[x]) === 0);
    if (group === 'guest' && allowdGroup) {
      return 'trial';
    }
    return allowdGroup;
  }, [group, sizes, size]);

  const { root, shield, height, isReady } = useShield(mode, size);

  return (
    <>
      <div ref={root} className={clsx(!isReady && 'blur', className)}>
        {children}
        {calcSize(size) > 0 && (
          <div
            className={clsx(
              'z-[2] w-full rounded-xl',
              height < 170 ? 'gap-2 p-2' : 'gap-4 p-4',
              'flex flex-col items-center justify-center backdrop-blur',
              'bg-[rgba(29,38,47,0.2)]',
              !isReady && 'hidden',
            )}
            ref={shield}
          >
            <Logo
              className={clsx('size-12 shrink', height < 130 && 'hidden')}
            />

            <p
              className={clsx(
                'shrink text-center text-xs capitalize text-v1-content-primary',
                height < 100 && 'hidden',
              )}
            >
              {group === 'guest'
                ? t('pro-locker.login.message')
                : nextGroup === 'pro'
                ? t('pro-locker.pro.message')
                : nextGroup === 'pro+'
                ? t('pro-locker.proplus.message')
                : nextGroup === 'pro_max'
                ? t('pro-locker.promax.message')
                : t('pro-locker.pro.message')}
            </p>

            <HoverTooltip
              title={
                <p className="whitespace-pre font-mono text-sm text-v1-background-notice">
                  {JSON.stringify([{ group, nextGroup }, sizes], null, 2)}
                </p>
              }
              disabled={!isDebugMode}
            >
              <button
                onClick={() => ensureGroup(nextGroup ?? 'pro_max')}
                className={clsx(
                  'inline-flex w-auto shrink-0 items-center gap-1',
                  'h-9 rounded-lg px-4 text-xs',
                  'bg-pro-gradient font-medium text-black transition-all hover:brightness-110',
                )}
              >
                <Sparkle />
                {group === 'guest'
                  ? t('pro-locker.login.button')
                  : nextGroup === 'pro'
                  ? t('pro-locker.pro.button')
                  : nextGroup === 'pro+'
                  ? t('pro-locker.proplus.button')
                  : nextGroup === 'pro_max'
                  ? t('pro-locker.promax.button')
                  : t('pro-locker.pro.button')}
              </button>
            </HoverTooltip>
            {loginModal}
          </div>
        )}
      </div>
    </>
  );
}
