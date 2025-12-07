import { useQuery } from '@tanstack/react-query';
import { bxGitBranch } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { RouterBaseName } from 'config/constants';
import { ofetch } from 'config/ofetch';
import Icon from 'shared/Icon';
import { Select } from 'shared/v1-components/Select';

const gotoBranch = (value = 'main') => {
  window.location.href = `/${value}${window.location.hash}`;
};

const BranchSelector = () => {
  const value = RouterBaseName.startsWith('/')
    ? RouterBaseName.slice(1)
    : RouterBaseName;
  const branches = useQuery({
    queryKey: ['branched'],
    queryFn: async () => {
      const data = await ofetch<string>(
        `${window.location.origin}/branches.txt`,
      );
      return data
        .split(/\s+/)
        .filter(Boolean)
        .map(x => (x.startsWith('/') ? x.slice(1) : x));
    },
  });

  return (
    <Select
      allowClear={false}
      block
      chevron={false}
      className="text-v1-content-primary max-md:w-xl"
      loading={branches.isLoading}
      onChange={gotoBranch}
      options={branches.data}
      prefixIcon={<Icon name={bxGitBranch} />}
      render={(opt, target) => {
        return (
          <div className={clsx(target === 'value' && 'max-md:hidden')}>
            {opt ?? 'main'}
          </div>
        );
      }}
      size="xs"
      surface={1}
      value={value}
    />
  );
};

export default BranchSelector;
