import { useCallback, useState } from 'react';
import Button from 'shared/Button';
import { useInvestorAssetStructuresQuery } from 'api';
import TitleHint from '../../TitleHint';
import CockpitTimeline from './CockpitTimeline';
import CockpitPositionHistory from './CockpitPositionHistory';

const TabCockpit = () => {
  const [isRunning, setIsRunning] = useState(false);
  const runCockpit = useCallback(() => setIsRunning(true), []);

  // const params = useParams<{ id: string }>();
  const ias = useInvestorAssetStructuresQuery();
  const id = ias.data?.[0]?.financial_product_instances[0].key;

  return (
    <div className="my-10 flex flex-col gap-10">
      {isRunning ? (
        <div className="flex flex-col gap-12">
          <CockpitTimeline strategyId={id} />
          <CockpitPositionHistory strategyId={id} />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <TitleHint title="Activate Strategy">
            By Clicking “Run Strategy” button, your cockpit will be created to
            run position or modify strategy
          </TitleHint>
          <Button onClick={runCockpit}>Run Strategy</Button>
        </div>
      )}
    </div>
  );
};

export default TabCockpit;
