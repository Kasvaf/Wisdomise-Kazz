import { clsx } from 'clsx';
import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from 'api';
import { useModalLogin } from '../ModalLogin';
import { useIsLoggedIn } from '../jwt-store';
import { SubscriptionRequiredModal } from './SubscriptionRequiredModal';

export function ProGuard({
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
  const parentEl = useRef<HTMLDivElement>(null);
  const isLoggedIn = useIsLoggedIn();
  const [ModalLogin, showModalLogin] = useModalLogin();
  const navigate = useNavigate();
  const [blockList, setBlockList] = useState<HTMLElement[]>([]);
  const subscription = useSubscription();
  const [subscriptionModal, setSubscriptionModal] = useState(false);
  const shouldBlock = subscription.levelType === 'free' && enabled !== false;

  useEffect(() => {
    if (!parentEl.current) return;
    const els =
      mode === 'table'
        ? [...parentEl.current.querySelectorAll('tbody > tr')]
        : parentEl.current.children;
    setBlockList(() => {
      const ret = [];
      for (const el of els) {
        if (ret.length <= (level ?? 1)) ret.push(el as HTMLElement);
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

  const [buttonPosition, setButtonPosition] = useState<{
    top: string;
    height: string;
  }>({
    top: '0px',
    height: '100%',
  });
  useEffect(() => {
    const top = Math.min(...blockList.map(r => r.offsetTop));
    const bottom = Math.max(
      ...blockList.map(r => r.offsetHeight + r.offsetTop),
    );
    setButtonPosition({
      top: `${top}px`,
      height: `${bottom - top}px`,
    });
  }, [blockList]);

  return (
    <>
      <div ref={parentEl} className={clsx('relative', className)}>
        {children}

        {blockList.length > 0 && shouldBlock && (
          <div
            className={clsx(
              'absolute left-0 z-10 flex w-full cursor-pointer flex-col gap-2 text-base font-medium',
              'group transition-all',
              mode === 'badge'
                ? 'items-end justify-start backdrop-grayscale'
                : 'items-center justify-center backdrop-blur-sm',
            )}
            style={{
              ...buttonPosition,
            }}
            onClick={async e => {
              e.preventDefault();
              e.stopPropagation();
              if (isLoggedIn) {
                setSubscriptionModal(true);
              } else {
                void showModalLogin();
              }
            }}
          >
            <b
              className={clsx(
                mode === 'badge' ? '-m-4 h-auto' : 'h-auto w-auto',
                'rounded-lg bg-pro-gradient px-3 py-1 text-xs font-medium text-black shadow-xl',
                'group-hover:brightness-110',
              )}
            >
              {isLoggedIn ? 'Unlock with Pro' : 'Login Required'}
            </b>
          </div>
        )}
      </div>
      <SubscriptionRequiredModal
        open={subscriptionModal}
        onClose={() => setSubscriptionModal(false)}
        onConfirm={() => navigate('/account/billing')}
      />
      {ModalLogin}
    </>
  );
}
