import { type FC } from 'react';
import { ReactComponent as EmptyIcon } from './empty.svg';

export const EmptyContent: FC = () => (
  <div className="flex flex-col items-center justify-center gap-2 py-12">
    <EmptyIcon className="size-20" />
    {'Nothing to Show'}
  </div>
);
