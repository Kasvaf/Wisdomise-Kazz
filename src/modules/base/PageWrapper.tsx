import { clsx } from 'clsx';
import type React from 'react';
import Spinner from 'shared/Spinner';

interface Props {
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const PageWrapper: React.FC<Props> = ({ children, loading, className }) => {
  if (loading) {
    return (
      <div
        className={clsx(
          'flex h-full w-full items-center justify-center mobile:h-[calc(100vh-10rem)]',
          className,
        )}
      >
        <Spinner />
      </div>
    );
  }

  return <div className={clsx('text-white', className)}>{children}</div>;
};

export default PageWrapper;
