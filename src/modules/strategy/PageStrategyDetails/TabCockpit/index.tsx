import { useParams } from 'react-router-dom';
import { useStrategyQuery } from 'api';
import Button from 'shared/Button';
import Spinner from 'shared/Spinner';
import TitleHint from '../../TitleHint';
import CockpitTimeline from './CockpitTimeline';
import CockpitPositionHistory from './CockpitPositionHistory';
import useRunCockpit from './useRunCockpit';

const TabCockpit = () => {
  const params = useParams<{ id: string }>();
  const { data: strategy, isLoading } = useStrategyQuery(params.id);
  const { runCockpit, isSaving, modals } = useRunCockpit(strategy);

  if (isLoading) {
    return (
      <div className="mt-10 flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="my-10 flex flex-col gap-10">
      {strategy?.has_active_entangled_fpi ? (
        <div className="flex flex-col gap-12">
          <CockpitTimeline strategyId={params.id} />
          <CockpitPositionHistory strategyId={params.id} />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <TitleHint title="Activate Strategy">
            By Clicking “Run Strategy” button, your cockpit will be created to
            run position or modify strategy
          </TitleHint>
          <Button onClick={runCockpit} loading={isSaving}>
            Run Strategy
          </Button>
        </div>
      )}
      {modals}
    </div>
  );
};

export default TabCockpit;
