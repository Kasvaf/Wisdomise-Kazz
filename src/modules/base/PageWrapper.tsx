import { clsx } from 'clsx';
import type React from 'react';
import Spinner from 'shared/Spinner';

interface Props {
  loading?: boolean;
  mountWhileLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const PageWrapper: React.FC<Props> = ({
  children,
  loading,
  className,
  mountWhileLoading,
}) => (
  <div
    className={clsx(
      'text-white',
      loading &&
        'flex h-full w-full items-center justify-center text-white mobile:h-[calc(100vh-10rem)]',
      className,
    )}
  >
    {loading && <Spinner />}
    <div
      className={clsx(
        loading
          ? 'pointer-events-none absolute -z-10 h-0 w-0 overflow-hidden opacity-0'
          : 'contents',
      )}
    >
      {(mountWhileLoading || !loading) && children}
    </div>
  </div>
);

export default PageWrapper;
