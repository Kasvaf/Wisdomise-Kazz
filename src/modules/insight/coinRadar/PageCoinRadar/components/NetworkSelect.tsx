import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNetworks } from 'api';
import { Select } from 'shared/v1-components/Select';

export const NetworkSelect: FC<{
  value?: string[];
  onChange?: (newValue?: string[]) => void;
  className?: string;
}> = ({ value, className, onChange }) => {
  const networks = useNetworks({
    filter: 'social-radar-24-hours',
  });
  const [query, setQuery] = useState('');
  const { t } = useTranslation('coin-radar');

  return (
    <Select
      className={className}
      block
      value={value}
      onChange={onChange}
      loading={networks.isLoading}
      allowClear
      showSearch
      searchValue={query}
      onSearch={setQuery}
      multiple
      render={val => {
        if (!val) return t('common.all_networks');
        const network = networks.data?.find(x => x.slug === val);
        if (!network) return val;
        return (
          <span>
            {network.icon_url ? (
              <img
                src={network.icon_url}
                alt={network.name}
                className="me-1 inline-block size-4 rounded-full bg-white align-middle"
              />
            ) : (
              <span className="me-1 inline-block size-4 rounded-full bg-white align-middle" />
            )}
            {network.name}
          </span>
        );
      }}
      options={
        networks.data
          ?.filter(x => x.name.toLowerCase().includes(query.toLowerCase()))
          .map(x => x.slug)
          .filter(x => !!x) ?? []
      }
    />
  );
};
