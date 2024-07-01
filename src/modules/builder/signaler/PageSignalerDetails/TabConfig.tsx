/* eslint-disable import/max-dependencies */
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { notification } from 'antd';
import { useTranslation } from 'react-i18next';
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
import TitleHint from '../../TitleHint';
import PublishNotice from '../../PublishNotice';
import MultiCoinsSelector from './MultiCoinsSelector';
import useDeleteSignaler from './useDeleteSignaler';

const TabConfig = () => {
  const { t } = useTranslation('builder');
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
      notification.success({ message: t('notif-saved-successfully') });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  const { ModalDeleteConfirm, deleteHandler, isDeleting } = useDeleteSignaler(
    params.id,
  );

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
          label={t('config.signaler-name')}
          placeholder={t('config.signaler-name')}
          value={changes.name ?? signaler.name}
          onChange={v => update('name', v)}
          className="basis-3/5"
          error={requiredCheck('name')}
        />

        <MarketSelector
          label={t('config.market')}
          selectedItem={changes.market_name ?? signaler.market_name}
          className="basis-1/5"
          disabled
        />

        <ResolutionSelector
          label={t('config.resolution')}
          selectedItem={changes.resolution ?? signaler.resolution}
          onSelect={v => update('resolution', v)}
          className="basis-1/5"
        />
      </div>

      <TitleHint title={t('config.assets.title')} className="mb-2 mt-10">
        {t('config.assets.description')}
      </TitleHint>
      <MultiCoinsSelector
        options={allowed ?? []}
        items={changes.assets ?? signaler.assets}
        onChange={v => update('assets', v)}
      />

      <section className="mt-8 flex justify-center gap-4">
        <Button
          loading={isDeleting}
          onClick={deleteHandler}
          variant="secondary-red"
        >
          {t('delete-signaler.title')}
        </Button>
        <Button
          disabled={!hasChanges || !!requiredCheck('name')}
          loading={isSaving}
          onClick={saveChanges}
        >
          {t('common:actions.save')}
        </Button>
      </section>

      <PublishNotice type="signaler" />
      {ModalDeleteConfirm}
    </div>
  );
};

export default TabConfig;
