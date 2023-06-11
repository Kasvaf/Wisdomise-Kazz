import Spinner from "components/spinner";
import React from "react";

interface Props {
  loading?: boolean;
  children?: React.ReactNode;
}

export const PageWrapper: React.FC<Props> = ({ children, loading }) => {
  if (loading) {
    return (
      <div className="mt-[50px] flex w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <div>{children}</div>;
};
