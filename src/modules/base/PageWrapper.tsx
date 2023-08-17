import type React from 'react';
import SpinnerV1 from 'shared/SpinnerV1';

interface Props {
  loading?: boolean;
  children?: React.ReactNode;
}

export const PageWrapper: React.FC<Props> = ({ children, loading }) => {
  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center mobile:h-[calc(100vh-10rem)]">
        <SpinnerV1 />
      </div>
    );
  }

  return <div>{children}</div>;
};
