import { type FC, type PropsWithChildren } from 'react';

export const TableArrayColumn: FC<PropsWithChildren> = ({ children }) => (
  <div className="!-mx-4 divide-y divide-white/10 [&>*]:h-[4.5rem] [&>*]:w-full [&>*]:p-4">
    {children}
  </div>
);
