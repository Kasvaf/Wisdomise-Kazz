import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { notification } from 'antd';
import Button from 'shared/Button';
import { useCreateStrategyEntangledFPI, useStrategyQuery } from 'api';
import { unwrapErrorMessage } from 'utils/error';
import TitleHint from '../../TitleHint';
import CockpitTimeline from './CockpitTimeline';
import CockpitPositionHistory from './CockpitPositionHistory';

const TabCockpit = () => {
  const params = useParams<{ id: string }>();
  const strategy = useStrategyQuery(params.id);

  const { mutateAsync, isLoading } = useCreateStrategyEntangledFPI();
  const runCockpit = useCallback(async () => {
    if (!params.id) return;
    try {
      await mutateAsync({
        strategyKey: params.id,
      });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  }, [mutateAsync, params.id]);

  return (
    <div className="my-10 flex flex-col gap-10">
      {strategy.data?.has_active_entangled_fpi ? (
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
          <Button onClick={runCockpit} loading={isLoading}>
            Run Strategy
          </Button>
        </div>
      )}
    </div>
  );
};

export default TabCockpit;
