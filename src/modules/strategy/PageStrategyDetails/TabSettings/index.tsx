/* eslint-disable import/max-dependencies */
import { Switch, notification } from 'antd';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  type StrategyAsset,
  type StrategyData,
  useStrategyQuery,
  useUpdateStrategyMutation,
} from 'api';
import MarketSelector from 'modules/account/MarketSelector';
import Card from 'shared/Card';
import Button from 'shared/Button';
import TextBox from 'shared/TextBox';
import Spinner from 'shared/Spinner';
import { unwrapErrorMessage } from 'utils/error';
import TitleHint from '../../TitleHint';
import PartDocs from './PartDocs';
import PartAssets from './PartAssets';

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

  const setName = useCallback((v: string) => update('name', v), [update]);
  const setTags = useCallback(
    (v: string) => update('tags', v.split(/[\s,]+/)),
    [update],
  );
  const cleanupTags = useCallback(() => {
    setChanges(cur => ({
      ...cur,
      tags: cur.tags?.filter(Boolean),
    }));
  }, []);

  const setAssets = useCallback(
    (v: StrategyAsset[]) => update('assets', v),
    [update],
  );

  const fieldHasChanges = (field: keyof StrategyData) =>
    changes[field] !== undefined && changes[field] !== strategy?.[field];

  const hasChanges =
    fieldHasChanges('name') ||
    fieldHasChanges('tags') ||
    fieldHasChanges('assets');

  // ------------------------------------------------------------------------

  const { mutateAsync, isLoading: isSaving } = useUpdateStrategyMutation();
  const saveChanges = useCallback(async () => {
    if (!params.id || !strategy) return;
    try {
      await mutateAsync({
        key: params.id,
        name: changes.name ?? strategy.name,
        tags: changes.tags ?? strategy.tags,
        assets: changes.assets ?? strategy.assets,
      });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  }, [changes, mutateAsync, params.id, strategy]);

  // ------------------------------------------------------------------------

  if (!strategy || isLoading) {
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

        <div className="mt-4 flex max-w-xl gap-6">
          <TextBox
            placeholder="Strategy Name"
            value={changes.name ?? strategy.name}
            onChange={setName}
            className="basis-2/3"
          />

          <MarketSelector
            selectedItem={changes.market_name ?? strategy.market_name}
            className="basis-1/3"
            disabled
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
            onChange={setTags}
            onBlur={cleanupTags}
            className="basis-2/3"
          />
        </div>
      </section>

      <PartAssets
        value={changes.assets ?? strategy.assets}
        onChange={setAssets}
      />

      <section className="flex justify-center gap-3">
        <Button disabled={!hasChanges} loading={isSaving} onClick={saveChanges}>
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
