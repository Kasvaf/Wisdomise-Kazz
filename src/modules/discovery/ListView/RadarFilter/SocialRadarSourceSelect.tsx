import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSocialRadarSources } from 'api';
import { Select } from 'shared/v1-components/Select';
import { SocialLogo } from '../../DetailView/CoinDetail/CoinMessagesWidget/SocialLogo';

export const SocialRadarSourceSelect: FC<{
  value?: string[];
  onChange?: (newValue?: string[]) => void;
  className?: string;
}> = ({ value, className, onChange }) => {
  const sources = useSocialRadarSources();
  const [query, setQuery] = useState('');
  const { t } = useTranslation('coin-radar');

  return (
    <Select
      className={className}
      block
      value={value}
      onChange={onChange}
      loading={sources.isLoading}
      allowClear
      showSearch
      searchValue={query}
      onSearch={setQuery}
      multiple
      render={val => {
        if (!val) return t('common.all_sources');
        const source = sources.data?.find(x => x.value === val);
        if (!source) return val;
        return (
          <span>
            <SocialLogo
              className="me-2 inline-block size-4 rounded-full align-middle"
              type={
                source.value.includes('telegram')
                  ? 'telegram'
                  : source.value.includes('reddit')
                  ? 'reddit'
                  : 'twitter'
              }
            />
            {source.name}
          </span>
        );
      }}
      options={
        sources.data
          ?.filter(x => x.name.toLowerCase().includes(query.toLowerCase()))
          .map(x => x.value)
          .filter(x => !!x) ?? []
      }
    />
  );
};
