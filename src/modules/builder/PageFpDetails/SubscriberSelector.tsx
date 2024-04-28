import type React from 'react';
import { Select } from 'antd';
import { bxChevronDown } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useFpSubscribersQuery } from 'api/builder';
import Icon from 'shared/Icon';

interface Props {
  fpKey?: string;
  label?: string;
  selectedItem?: string;
  onSelect?: (spi: string) => void;
  disabled?: boolean;
  className?: string;
}

const filterOption = (
  input: string,
  option?: { label: string; value: string },
) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const SubscriberSelector: React.FC<Props> = ({
  fpKey,
  label,
  selectedItem,
  onSelect,
  disabled = false,
  className,
}) => {
  const { t } = useTranslation('builder');
  const { data: spis, isLoading } = useFpSubscribersQuery({ fpKey });
  const options = spis?.map(sub => ({
    value: sub.key,
    label: sub.title,
  }));

  return (
    <div className={className}>
      {label && <label className="mb-2 ml-2 block">{label}</label>}

      <Select
        showSearch
        placeholder={t('subscriber-selector.choose-account')}
        optionFilterProp="children"
        onChange={onSelect}
        filterOption={filterOption}
        loading={isLoading}
        options={options}
        disabled={disabled}
        value={selectedItem}
        className="w-full"
        suffixIcon={<Icon name={bxChevronDown} className="mr-2 text-white" />}
      />
    </div>
  );
};

export default SubscriberSelector;
