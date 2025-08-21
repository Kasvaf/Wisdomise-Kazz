import { clsx } from 'clsx';
import type { ReactNode } from 'react';

const MessageBox: React.FC<
  React.PropsWithChildren<{
    variant: 'error' | 'warning';
    title?: string | ReactNode;
    className?: string;
  }>
> = ({ variant, title, children, className }) => {
  return (
    <div
      className={clsx(
        'rounded-lg border p-2 text-sm',
        variant === 'error'
          ? 'border-v1-border-negative bg-v1-background-negative/5'
          : 'border-v1-border-notice bg-v1-background-notice/5',
        className,
      )}
    >
      {title && <div className="mb-1 font-medium text-base">{title}</div>}
      <div>{children}</div>
    </div>
  );
};
export default MessageBox;
