import { Select } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { bxChevronDown } from 'boxicons-quasar';
import { RouterBaseName } from 'config/constants';
import Icon from 'shared/Icon';
import { ofetch } from 'config/ofetch';

const gotoBranch = (value: string) => {
  window.location.href = value + window.location.hash;
};

const BranchSelector = () => {
  const branches = useQuery(['branched'], async () => {
    const data = await ofetch<string>(window.location.origin + '/branches.txt');
    return data
      .split(/\s+/)
      .filter(Boolean)
      .map(value => ({ value, label: value.substring(1) }));
  });

  return (
    <Select
      style={{ width: 100 }}
      defaultValue={RouterBaseName}
      loading={branches.isLoading}
      onChange={gotoBranch}
      options={branches.data}
      className="mr-2 text-white"
      suffixIcon={<Icon name={bxChevronDown} className="mr-2 text-white" />}
    />
  );
};

export default BranchSelector;
