import type { FC } from 'react';
import { ReactComponent as EmptyIcon } from './empty.svg';

export const EmptyContent: FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-12">
    <EmptyIcon className="size-20" />
    {message ?? 'Nothing to Show'}
  </div>
);
