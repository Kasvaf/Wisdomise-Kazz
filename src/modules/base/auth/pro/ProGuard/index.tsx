import { clsx } from 'clsx';
import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from 'api';
import './style.css';
import { SubscriptionRequiredModal } from '../SubscriptionRequiredModal';
import { ReactComponent as ProIcon } from './pro.svg';

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
              'absolute left-0 flex w-full cursor-pointer flex-col gap-2 text-base font-medium',
              mode === 'badge'
                ? 'items-end justify-start'
                : 'items-center justify-center',
            )}
            style={{
              ...buttonPosition,
            }}
            onClick={e => {
              setSubscriptionModal(true);
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ProIcon
              className={clsx(
                mode === 'badge' ? '-m-2 h-auto' : 'h-6 w-auto',
                'shadow-lg',
              )}
            />
          </div>
        )}
      </div>
      <SubscriptionRequiredModal
        open={subscriptionModal}
        onClose={() => setSubscriptionModal(false)}
        onConfirm={() => navigate('/account/billing')}
      />
    </>
  );
}

// {/* {shouldBlock && (

// )} */}
