import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { type Surface, useSurface } from 'utils/useSurface';

export default function Skeleton({
  className,
  children,
  surface = 1,
}: {
  className?: string;
  children?: ReactNode;
  surface?: Surface;
}) {
  const { current } = useSurface(surface);
  return (
    <div
      className={clsx(
        current,
        'min-h-3 animate-pulse rounded-md bg-(--current) text-transparent',
        className,
      )}
      style={{ '--current': current } as never}
    >
      {children ?? 'loading...'}
    </div>
  );
}
