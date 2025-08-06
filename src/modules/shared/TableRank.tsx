import { clsx } from 'clsx';
import { type FC, type ReactNode } from 'react';

export const TableRank: FC<{
  highlighted?: boolean;
  children?: ReactNode;
}> = ({ highlighted, children }) => (
  <div className="contents">
    {highlighted && (
      <>
        <div
          className={clsx(
            'absolute left-0 top-0 h-full w-full opacity-15 mobile:opacity-30',
            'bg-gradient-to-r from-[#f587ff] via-[#116697b4] to-transparent blur-sm',
          )}
        />
        <div
          className={clsx(
            'absolute left-0 top-0 h-full w-1 opacity-90 mobile:w-[3px]',
            'bg-brand-gradient-vertical',
          )}
        />
      </>
    )}
    {children}
  </div>
);
