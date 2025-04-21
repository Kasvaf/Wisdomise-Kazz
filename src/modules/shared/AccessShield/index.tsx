import { clsx } from 'clsx';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { useTranslation } from 'react-i18next';
import { type UserGroup, useSubscription } from 'api';
import { isDebugMode } from 'utils/version';
import { HoverTooltip } from 'shared/HoverTooltip';
import { Button } from 'shared/v1-components/Button';
import { useMutationObserver } from 'utils/useMutationObserver';
import { ReactComponent as Logo } from './logo.svg';
import { ReactComponent as Sparkle } from './sparkle.svg';

const calcSize = (size: number | boolean) =>
  size === true ? 999 : size === false ? 0 : size < 1 ? 0 : size;

const useShield = (
  mode: 'table' | 'mobile_table' | 'children',
  size: number | boolean,
) => {
  const root = useRef<HTMLDivElement>(null);
  const shield = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(!!(size === 0 || size === false));
  const [height, setHeight] = useState(150);
  const [maxHeight, setMaxHeight] = useState(150);

  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateStyle = useCallback(() => {
    if (timeout.current !== null) clearTimeout(timeout.current);
    if (!root.current) return;
    try {
      if (!root.current || !shield.current) return;
      const blockList = (
        mode === 'table'
          ? [
              ...root.current.querySelectorAll(
                'tbody > tr:not([aria-hidden]):not(.ant-table-placeholder)',
              ),
            ]
          : mode === 'mobile_table'
          ? [...root.current.querySelectorAll('[data-table="tr"]')]
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
        return;
      }

      const top = Math.min(...blockList.map(r => r.offsetTop ?? 0));
      const bottom = Math.max(
        ...blockList.map(r => (r.offsetHeight ?? 0) + (r.offsetTop ?? 0)),
      );
      const minHeight = 40;
      const [h, mh] = [
        bottom - top,
        Math.max(minHeight, root.current.offsetHeight),
      ];
      root.current.setAttribute('size', size.toString());
      root.current.style.overflow = size === true ? 'hidden' : '';
      root.current.style.maxHeight = size === true ? '100%' : '';
      root.current.style.position = 'relative';
      shield.current.style.maxHeight = `${mh}px`;
      shield.current.style.top = `${top}px`;
      shield.current.style.left = '0px';
      shield.current.style.width = '100%';
      shield.current.style.height = `${h}px`;
      shield.current.style.overflow = 'hidden';
      shield.current.style.position = 'absolute';
      shield.current.style.margin = '0';
      shield.current.style.display = '';
      shield.current.style.willChange = 'height';
      setHeight(h);
      setMaxHeight(mh);
    } catch {
    } finally {
      setIsReady(true);
    }
  }, [mode, size]);

  useMutationObserver(root, updateStyle, {
    childList: true,
    subtree: true,
  });

  return { root, shield, isReady, height, maxHeight };
};

export function AccessShield({
  children,
  className,
  mode,
  sizes,
}: PropsWithChildren<{
  className?: string;
  mode: 'table' | 'mobile_table' | 'children';
  sizes: Record<UserGroup, number | boolean>;
}>) {
  const { t } = useTranslation('pro');
  const { ensureGroup, group, loginModal } = useSubscription();

  const size = sizes[group];

  const nextGroup = useMemo<UserGroup | undefined>(() => {
    const sizeNumber = calcSize(size);
    if (sizeNumber === 0) return;
    const groups: UserGroup[] = ['guest', 'initial', 'vip'];
    const allowdGroup = groups.find(x => calcSize(sizes[x]) === 0);
    return allowdGroup ?? 'vip';
  }, [sizes, size]);

  const { root, shield, height, maxHeight, isReady } = useShield(mode, size);

  return (
    <>
      <div
        ref={root}
        className={clsx(!isReady && 'blur transition-all', className)}
      >
        {children}
        {calcSize(size) > 0 && (
          <div
            className={clsx(
              'z-[2] w-full rounded-xl',
              height < 170 ? 'gap-2 p-2' : 'gap-4 p-4',
              maxHeight < 900 ? 'justify-center' : 'justify-start',
              'flex flex-col items-center backdrop-blur',
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
                : 'Join Wise Club for exclusive insights to elevate your crypto game!'}
            </p>

            <HoverTooltip
              title={
                <p className="whitespace-pre font-mono text-sm text-v1-background-notice">
                  {JSON.stringify([{ group, nextGroup }, sizes], null, 2)}
                </p>
              }
              disabled={!isDebugMode}
            >
              <Button
                onClick={() => ensureGroup(nextGroup ?? 'vip')}
                variant="pro"
                size="sm"
                className="shrink-0"
              >
                <Sparkle />
                {group === 'guest'
                  ? t('pro-locker.login.button')
                  : 'Join Wise Club'}
              </Button>
            </HoverTooltip>
            {loginModal}
          </div>
        )}
      </div>
    </>
  );
}
