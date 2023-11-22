import type React from 'react';
import { Select } from 'antd';
import { useStrategySpiQuery } from 'api';

interface Props {
  strategyKey?: string;
  selectedItem?: string;
  onSelect?: (spi: string) => void;
  disabled?: boolean;
}

const filterOption = (
  input: string,
  option?: { label: string; value: string },
) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const SpiSelector: React.FC<Props> = ({
  strategyKey,
  selectedItem,
  onSelect,
  disabled = false,
}) => {
  const { data: spis, isLoading } = useStrategySpiQuery({ strategyKey });
  const options = spis?.map(spi => ({
    value: spi.key,
    label: spi.title,
  }));

  return (
    <Select
      showSearch
      placeholder="Select a SPI"
      optionFilterProp="children"
      onChange={onSelect}
      filterOption={filterOption}
      loading={isLoading}
      options={options}
      disabled={disabled}
      value={selectedItem}
      className="w-[250px]"
    />
  );
};

export default SpiSelector;
