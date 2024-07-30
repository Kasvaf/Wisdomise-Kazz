import { useEffect, useState } from 'react';
import PageWrapper from 'modules/base/PageWrapper';
import { useIsWhalesFetching } from '../useIsWhalesFetching';
import { WhalesTable } from './WhalesTable';
import { CoinsTable } from './CoinsTable';
import { TopCoins } from './TopCoins';

export default function PageWhales() {
  const isFetching = useIsWhalesFetching();
  const [isLoading, setIsLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState(1);
  useEffect(() => {
    if (!isFetching) setIsLoading(false);
  }, [isFetching]);

  return (
    <PageWrapper loading={isLoading} mountWhileLoading>
      <div className="flex flex-col gap-4">
        <WhalesTable />
        <hr className="opacity-5" />
        <CoinsTable timeFrame={timeFrame} onTimeFrameChange={setTimeFrame} />
        <hr className="opacity-5" />
        <div className="grid grid-cols-2 gap-8 mobile:grid-cols-1">
          <TopCoins signalType="gainer" timeFrame={timeFrame} />
          <TopCoins signalType="loser" timeFrame={timeFrame} />
        </div>
      </div>
    </PageWrapper>
  );
}
