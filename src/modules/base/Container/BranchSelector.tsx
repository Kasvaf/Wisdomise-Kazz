import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Select } from 'antd';
import { RouterBaseName } from 'config/constants';

const BranchSelector = () => {
  const branches = useQuery(['branched'], async () => {
    const res = await axios.get<string>(
      window.location.origin + '/branches.txt',
    );
    return res.data
      .split(/\s+/)
      .filter(Boolean)
      .map(value => ({ value, label: value }));
  });

  const handleChange = useCallback((value: string) => {
    window.location.href = '/' + value + window.location.hash;
  }, []);

  return (
    <Select
      style={{ width: 100 }}
      defaultValue={RouterBaseName}
      loading={branches.isLoading}
      onChange={handleChange}
      options={branches.data}
      className="text-white"
    />
  );
};

export default BranchSelector;
