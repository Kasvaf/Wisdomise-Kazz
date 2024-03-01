import { Select } from 'antd';
import { bxChevronDown } from 'boxicons-quasar';
import type React from 'react';
import Icon from 'shared/Icon';

interface SignalerInfo {
  key: string;
  name: string;
}

interface Props {
  label?: string;
  isLoading?: boolean;
  signalers?: SignalerInfo[];
  selectedItem?: string;
  onSelect?: (signaler: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const filterOption = (
  input: string,
  option?: { label: string; value: string },
) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const SignalerSelector: React.FC<Props> = ({
  label,
  signalers = [],
  selectedItem,
  onSelect,
  disabled = false,
  placeholder = label,
  isLoading,
  className,
}) => {
  return (
    <div className={className}>
      {label && <label className="mb-2 ml-4 block">{label}</label>}

      <Select
        showSearch
        placeholder={placeholder}
        optionFilterProp="children"
        onChange={onSelect}
        filterOption={filterOption}
        loading={isLoading}
        options={signalers.map(sub => ({
          value: sub.key,
          label: sub.name,
        }))}
        disabled={disabled}
        value={selectedItem}
        suffixIcon={<Icon name={bxChevronDown} className="mr-2 text-white" />}
        className="w-full"
      />
    </div>
  );
};

export default SignalerSelector;
