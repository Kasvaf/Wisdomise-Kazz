/* eslint-disable jsx-a11y/label-has-associated-control */
import { Select } from 'antd';
import TextBox from 'shared/TextBox';
import { type ConditionDefinition } from './types';
const { Option } = Select;

const FormPrice: ConditionDefinition['Component'] = ({ value, onChange }) => {
  if (value?.type !== 'compare') return null;

  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <label className="mb-2 ml-2 block">Operator</label>
        <Select
          value={value.op}
          onChange={op => onChange({ ...value, op })}
          suffixIcon={null}
        >
          <Option value="<=">&lt;=</Option>
          <Option value=">=">&gt;=</Option>
        </Select>
      </div>
      <TextBox
        label="Price"
        value={String(value.right)}
        onChange={r => onChange({ ...value, right: +r })}
        className="grow"
      />
    </div>
  );
};

export default function usePriceDefinition(): ConditionDefinition {
  return {
    title: 'Price',
    default: {
      type: 'compare',
      op: '<=',
      left: 'price',
      right: 0,
    },
    Component: FormPrice,
  };
}
