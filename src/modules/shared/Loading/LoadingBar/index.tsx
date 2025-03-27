import { clsx } from 'clsx';
import { type FC } from 'react';
import './style.css';

export const LoadingBar: FC<{ value?: boolean; className?: string }> = ({
  value,
  className,
}) => {
  return (
    <div
      className={clsx(
        'pointer-events-none overflow-hidden bg-transparent transition-all duration-500',
        !value && 'opacity-0',
        className,
      )}
    >
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className={clsx('h-full w-1/2 bg-white', 'slide-animation')} />
    </div>
  );
};
