import { type FC } from 'react';
import Spinner from 'shared/Spinner';

export const LoadingSpinner: FC = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <Spinner className="size-10" />
  </div>
);
