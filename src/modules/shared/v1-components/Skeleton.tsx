import { clsx } from 'clsx';

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'min-h-3 animate-pulse rounded-md bg-v1-surface-l1 text-transparent',
        className,
      )}
    />
  );
}
