import { clsx } from 'clsx';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import type React from 'react';
import Spinner from 'shared/Spinner';
import Layout, { type LayoutProps } from './Layout';

interface Props {
  loading?: boolean;
  mountWhileLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export type PageWrapperProps = Props & LayoutProps;

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  loading,
  className,
  mountWhileLoading,
  ...layoutProps
}) => {
  const { isEmbeddedView } = useEmbedView();

  return (
    <Layout {...layoutProps}>
      <div
        className={clsx(
          'text-white',
          loading &&
            'flex h-full mobile:h-[calc(100vh-10rem)] w-full items-center justify-center',
          className,
        )}
      >
        {loading && !isEmbeddedView && <Spinner />}
        <div
          className={clsx(
            loading
              ? '-z-10 pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0'
              : 'contents',
          )}
        >
          {(mountWhileLoading || !loading) && children}
        </div>
      </div>
    </Layout>
  );
};

export default PageWrapper;
