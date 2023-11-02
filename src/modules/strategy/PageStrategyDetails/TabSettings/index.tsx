/* eslint-disable import/max-dependencies */
import { Switch, notification } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  type StrategyData,
  useStrategyQuery,
  useUpdateStrategyMutation,
} from 'api';
import { unwrapErrorMessage } from 'utils/error';
import MarketSelector from 'modules/account/MarketSelector';
import ResolutionSelector from 'modules/strategy/ResolutionSelector';
import Card from 'shared/Card';
import Button from 'shared/Button';
import TextBox from 'shared/TextBox';
import Spinner from 'shared/Spinner';
import deepEqual from 'shared/deepEqual';
import TitleHint from '../../TitleHint';
import PartAssets from './PartAssets';
import PartDocs from './PartDocs';

const TabSettings = () => {
  const params = useParams<{ id: string }>();
  const { data: strategy, isLoading } = useStrategyQuery(params.id);

  // ------------------------------------------------------------------------

  const [changes, setChanges] = useState<Partial<StrategyData>>({});
  const update = useCallback((field: keyof StrategyData, value: any) => {
    setChanges(cur => ({
      ...cur,
      [field]: value,
    }));
  }, []);

  const cleanupTags = () => {
    setChanges(cur => ({
      ...cur,
      tags: cur.tags?.filter(Boolean),
    }));
  };

  const fieldHasChanges = (field: keyof StrategyData) =>
    changes[field] !== undefined &&
    !deepEqual(changes[field], strategy?.[field]);

  const hasChanges =
    fieldHasChanges('name') ||
    fieldHasChanges('tags') ||
    fieldHasChanges('assets');

  const assets = changes.assets ?? strategy?.assets;
  const assetsAreValid =
    !assets?.length || assets?.reduce((a, b) => a + b.share, 0) === 100;

  // ------------------------------------------------------------------------

  const { mutateAsync, isLoading: isSaving } = useUpdateStrategyMutation();
  const saveChanges = async () => {
    if (!params.id || !strategy || !assetsAreValid) return;
    try {
      await mutateAsync({
        key: params.id,
        name: changes.name ?? strategy.name,
        resolution: changes.resolution ?? strategy.resolution,
        tags: changes.tags ?? strategy.tags,
        assets: changes.assets ?? strategy.assets,
      });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  // ------------------------------------------------------------------------

  const navigate = useNavigate();
  useEffect(() => {
    if (!params.id) {
      navigate('/app/strategy');
    }
  }, [params.id, navigate]);

  if (!strategy || isLoading || !params.id) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="my-10 flex flex-col gap-10">
      <Card className="flex items-center justify-between">
        <TitleHint title="Strategy Status">
          Enabling this strategy source will allow it to send data into Segment
          and any connected enabled destinations.
        </TitleHint>

        <div>
          <Switch checked={changes.is_active ?? strategy.is_active} />
        </div>
      </Card>

      <section>
        <TitleHint className="ml-3" title="Strategy Name">
          Pick a name to help you identify this strategy.
        </TitleHint>

        <div className="mt-4 flex max-w-4xl gap-6">
          <TextBox
            placeholder="Strategy Name"
            value={changes.name ?? strategy.name}
            onChange={v => update('name', v)}
            className="basis-3/5"
          />

          <MarketSelector
            selectedItem={changes.market_name ?? strategy.market_name}
            className="basis-1/5"
            disabled
          />

          <ResolutionSelector
            selectedItem={changes.resolution ?? strategy.resolution}
            onSelect={v => update('resolution', v)}
            className="basis-1/5"
          />
        </div>
      </section>

      <section>
        <TitleHint className="ml-3" title="Labels & Tags">
          Set labels to help organize and filter your sources, as well as
          enforce more granular access permissions.
        </TitleHint>

        <div className="mt-4 flex max-w-xl gap-6">
          <TextBox
            placeholder="Strategy tags"
            value={(changes.tags ?? strategy.tags ?? []).join(', ')}
            onChange={v => update('tags', v.split(/[\s,]+/))}
            onBlur={cleanupTags}
            className="basis-2/3"
          />
        </div>
      </section>

      <PartAssets
        strategyKey={params.id}
        value={changes.assets ?? strategy.assets}
        onChange={v => update('assets', v)}
        error={
          !(changes.assets ?? strategy.assets) ||
          assetsAreValid ||
          'Total of assets shares must be 100%'
        }
      />

      <section className="flex justify-center gap-3">
        <Button
          disabled={!hasChanges || !assetsAreValid}
          loading={isSaving}
          onClick={saveChanges}
        >
          Save
        </Button>
        <Button variant="secondary">Go to Cockpit</Button>
      </section>

      <hr className="border-white/10" />

      <PartDocs
        strategyId={strategy.strategy_id}
        secretKey={strategy.secret_key}
      />
    </div>
  );
};

export default TabSettings;
