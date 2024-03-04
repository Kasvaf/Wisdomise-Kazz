import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { notification } from 'antd';
import {
  type SignalerData,
  useSignalerQuery,
  useSignalerAllowedAssetsQuery,
  useUpdateSignalerMutation,
} from 'api/builder';
import { unwrapErrorMessage } from 'utils/error';
import MarketSelector from 'modules/account/MarketSelector';
import ResolutionSelector from 'shared/ResolutionSelector';
import deepEqual from 'shared/deepEqual';
import TextBox from 'shared/TextBox';
import Spinner from 'shared/Spinner';
import Button from 'shared/Button';
import TitleHint from '../TitleHint';
import MultiCoinsSelector from './MultiCoinsSelector';
import PublishNotice from './PublishNotice';

const TabConfig = () => {
  const params = useParams<{ id: string }>();
  const { data: signaler, isLoading } = useSignalerQuery(params.id);
  const { data: allowed } = useSignalerAllowedAssetsQuery(params.id);

  const [changes, setChanges] = useState<Partial<SignalerData>>({});
  const update = useCallback((field: keyof SignalerData, value: any) => {
    setChanges(cur => ({
      ...cur,
      [field]: value,
    }));
  }, []);

  const requiredCheck = (field: keyof SignalerData) =>
    !(changes[field] ?? signaler?.[field]) && 'This field is required';

  // ----------------------------------------------------------------------

  const fieldHasChanges = (field: keyof SignalerData) =>
    changes[field] !== undefined &&
    !deepEqual(changes[field], signaler?.[field]);

  const hasChanges =
    fieldHasChanges('name') ||
    fieldHasChanges('tags') ||
    fieldHasChanges('resolution') ||
    fieldHasChanges('assets');

  // ----------------------------------------------------------------------

  const { mutateAsync, isLoading: isSaving } = useUpdateSignalerMutation();
  const saveChanges = async () => {
    if (!params.id || !signaler) return;
    try {
      await mutateAsync({
        key: params.id,
        name: changes.name ?? signaler.name,
        resolution: changes.resolution ?? signaler.resolution,
        tags: changes.tags ?? signaler.tags,
        assets: changes.assets ?? signaler.assets,
      });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  if (!signaler || isLoading || !params.id) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mt-8 flex max-w-4xl gap-6 mobile:flex-col">
        <TextBox
          label="Signaler Name"
          placeholder="Signaler Name"
          value={changes.name ?? signaler.name}
          onChange={v => update('name', v)}
          className="basis-3/5"
          error={requiredCheck('name')}
        />

        <MarketSelector
          label="Market"
          selectedItem={changes.market_name ?? signaler.market_name}
          className="basis-1/5"
          disabled
        />

        <ResolutionSelector
          label="Resolution"
          selectedItem={changes.resolution ?? signaler.resolution}
          onSelect={v => update('resolution', v)}
          className="basis-1/5"
        />
      </div>

      <TitleHint title="Assets" className="mb-2 mt-10">
        Click on plus button to add from crypto supported list
      </TitleHint>
      <MultiCoinsSelector
        options={allowed ?? []}
        items={changes.assets ?? signaler.assets}
        onChange={v => update('assets', v)}
      />

      <section className="mt-8 flex justify-center">
        <Button
          disabled={!hasChanges || !!requiredCheck('name')}
          loading={isSaving}
          onClick={saveChanges}
        >
          Save
        </Button>
      </section>

      <PublishNotice />
    </div>
  );
};

export default TabConfig;
