import axios from 'axios';
import { Select } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { bxChevronDown } from 'boxicons-quasar';
import { RouterBaseName } from 'config/constants';
import Icon from 'shared/Icon';

const gotoBranch = (value: string) => {
  window.location.href = value + window.location.hash;
};

const BranchSelector = () => {
  const branches = useQuery(['branched'], async () => {
    const res = await axios.get<string>(
      window.location.origin + '/branches.txt',
    );
    return res.data
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
