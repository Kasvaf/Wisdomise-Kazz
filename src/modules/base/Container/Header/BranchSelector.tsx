import { useQuery } from '@tanstack/react-query';
import { bxGitBranch } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { RouterBaseName } from 'config/constants';
import { ofetch } from 'config/ofetch';
import Icon from 'shared/Icon';
import { Select } from 'shared/v1-components/Select';

const gotoBranch = (value = 'main') => {
  window.location.href = value + window.location.hash;
};

const BranchSelector = () => {
  const branches = useQuery(['branched'], async () => {
    const data = await ofetch<string>(window.location.origin + '/branches.txt');
    return data.split(/\s+/).filter(Boolean);
  });

  return (
    <Select
      className="text-v1-content-primary mobile:w-xl"
      chevron={false}
      size="xl"
      tooltipPlacement="bottomRight"
      value={RouterBaseName}
      loading={branches.isLoading}
      onChange={gotoBranch}
      allowClear={false}
      block
      surface={1}
      options={branches.data}
      prefixIcon={<Icon name={bxGitBranch} />}
      render={(opt, target) => {
        return (
          <div className={clsx(target === 'value' && 'mobile:hidden')}>
            {(opt ?? '/main').slice(1)}
          </div>
        );
      }}
    />
  );
};

export default BranchSelector;
