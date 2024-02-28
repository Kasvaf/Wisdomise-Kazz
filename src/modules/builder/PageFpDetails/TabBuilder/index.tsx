import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Select, notification } from 'antd';
import {
  type MyFinancialProduct,
  useMyFinancialProductQuery,
  useUpdateMyFinancialProductMutation,
} from 'api/builder';
import { unwrapErrorMessage } from 'utils/error';
import deepEqual from 'shared/deepEqual';
import TextBox from 'shared/TextBox';
import Spinner from 'shared/Spinner';
import Button from 'shared/Button';
import AmountInputBox from 'shared/AmountInputBox';
import AssetManager from './AssetManager';
const { Option } = Select;

const TabBuilder = () => {
  const params = useParams<{ id: string }>();
  const { data: fp, isLoading } = useMyFinancialProductQuery(params.id);

  const [changes, setChanges] = useState<Partial<MyFinancialProduct>>({});
  const update = useCallback((field: keyof MyFinancialProduct, value: any) => {
    setChanges(cur => ({
      ...cur,
      [field]: value,
    }));
  }, []);

  // ----------------------------------------------------------------------

  const fieldHasChanges = (field: keyof MyFinancialProduct) =>
    changes[field] !== undefined && !deepEqual(changes[field], fp?.[field]);

  const hasChanges =
    fieldHasChanges('title') ||
    fieldHasChanges('description') ||
    fieldHasChanges('expected_apy') ||
    fieldHasChanges('expected_drawdown') ||
    fieldHasChanges('risk_level') ||
    fieldHasChanges('assets');

  // ----------------------------------------------------------------------

  const { mutateAsync, isLoading: isSaving } =
    useUpdateMyFinancialProductMutation();
  const saveChanges = async () => {
    if (!params.id || !fp) return;
    try {
      await mutateAsync({
        fpKey: params.id,
        title: changes.title ?? fp.title,
        description: changes.description ?? fp.description,
        expected_apy: changes.expected_apy ?? fp.expected_apy,
        expected_drawdown: changes.expected_drawdown ?? fp.expected_drawdown,
        risk_level: changes.risk_level ?? fp.risk_level,
        assets: changes.assets ?? fp.assets,
      });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  if (!fp || isLoading || !params.id) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <section>
        <div className="mt-4 flex gap-6">
          <TextBox
            label="Financial Product Name"
            placeholder="Financial Product Name"
            className="basis-2/5"
            value={changes.title ?? fp.title}
            onChange={v => update('title', v)}
          />

          <TextBox
            label="Financial Product Description"
            placeholder="Financial Product Description"
            className="basis-3/5"
            value={changes.description ?? fp.description}
            onChange={v => update('description', v)}
          />
        </div>

        <div className="mt-8 flex gap-6">
          <AmountInputBox
            label="Expected Drawdown"
            placeholder="Expected Drawdown"
            className="basis-1/3"
            value={changes.expected_drawdown ?? fp.expected_drawdown}
            onChange={v => update('expected_drawdown', v)}
          />
          <AmountInputBox
            label="Expected APY"
            placeholder="Expected APY"
            className="basis-1/3"
            value={changes.expected_apy ?? fp.expected_apy}
            onChange={v => update('expected_apy', v)}
          />

          <div className="basis-1/3">
            <div className="mb-2 ml-4">Risk Level</div>
            <Select
              className="w-full"
              placeholder="Risk Level"
              value={changes.risk_level ?? fp.risk_level}
              onChange={v => update('risk_level', v)}
            >
              <Option value="Low">Low</Option>
              <Option value="Medium">Medium</Option>
              <Option value="High">High</Option>
            </Select>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <AssetManager
            fpKey={params.id}
            value={changes.assets ?? fp.assets}
            onChange={v => update('assets', v)}
          />
        </div>
      </section>

      <section className="mt-8 flex justify-center">
        <Button disabled={!hasChanges} loading={isSaving} onClick={saveChanges}>
          Save
        </Button>
      </section>
    </div>
  );
};

export default TabBuilder;
