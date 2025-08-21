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
            'absolute top-0 left-0 h-full w-full mobile:opacity-30 opacity-15',
            'bg-gradient-to-r from-[#f587ff] via-[#116697b4] to-transparent blur-sm',
          )}
        />
        <div
          className={clsx(
            'absolute top-0 left-0 h-full mobile:w-[3px] w-1 opacity-90',
            'bg-brand-gradient-vertical',
          )}
        />
      </>
    )}
    {children}
  </div>
);
