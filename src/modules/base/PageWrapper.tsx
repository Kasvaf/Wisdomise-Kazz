import type React from 'react';
import Spinner from 'shared/Spinner';

interface Props {
  loading?: boolean;
  children?: React.ReactNode;
}

const PageWrapper: React.FC<Props> = ({ children, loading }) => {
  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center mobile:h-[calc(100vh-10rem)]">
        <Spinner />
      </div>
    );
  }

  return <div>{children}</div>;
};

export default PageWrapper;
