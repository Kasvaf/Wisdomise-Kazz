import { bxLoaderAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type FC } from 'react';
import Icon from 'shared/Icon';

export const LoadingBadge: FC<{
  value?: boolean;
  className?: string;
  text?: string;
}> = ({ value, className, text = 'Updating...' }) => (
  <div
    className={clsx(
      'pointer-events-none inline-flex h-6 items-center justify-center gap-1 transition-all duration-500',
      !value && 'opacity-0',
      className,
    )}
  >
    <Icon
      name={bxLoaderAlt}
      className="animate-spin align-baseline"
      size={14}
    />
    {text && <div className="text-xxs">{text}</div>}
  </div>
);
