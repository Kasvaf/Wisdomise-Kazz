import type React from 'react';
import { useSignalsQuery } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import SignalMatrix from './SignalMatrix';

const PageSignalsMatrix: React.FC = () => {
  const { data, isLoading } = useSignalsQuery();

  return (
    <PageWrapper loading={isLoading}>
      <h1 className="mb-7 mt-2 text-xl font-semibold text-white">
        Latest Positions
      </h1>
      {data && <SignalMatrix signals={data} />}
    </PageWrapper>
  );
};

export default PageSignalsMatrix;
