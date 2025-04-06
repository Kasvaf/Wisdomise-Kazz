import { clsx } from 'clsx';
import type React from 'react';
import Spinner from 'shared/Spinner';
import { useEmbedView } from 'modules/embedded/useEmbedView';

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
}) => {
  const { isEmbeddedView } = useEmbedView();

  return (
    <div
      className={clsx(
        'text-white',
        loading &&
          'flex h-full w-full items-center justify-center text-white mobile:h-[calc(100vh-10rem)]',
        className,
      )}
    >
      {loading && !isEmbeddedView && <Spinner />}
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
};

export default PageWrapper;
