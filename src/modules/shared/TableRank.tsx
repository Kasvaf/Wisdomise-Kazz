import { clsx } from 'clsx';
import type { FC, ReactNode } from 'react';

export const TableRank: FC<{
  highlighted?: boolean;
  children?: ReactNode;
}> = ({ highlighted, children }) => (
  <div className="contents">
    {highlighted && (
      <>
        <div
          className={clsx(
            'absolute top-0 left-0 h-full w-16 rounded-l-xl opacity-15 max-md:opacity-30',
            'bg-gradient-to-r from-[#f587ff] via-[#116697b4] to-transparent blur-sm',
          )}
        />
        <div
          className={clsx(
            'absolute top-0 left-0 h-full w-1 opacity-90 max-md:w-[3px]',
            'bg-brand-gradient-vertical',
          )}
        />
      </>
    )}
    {children}
  </div>
);
