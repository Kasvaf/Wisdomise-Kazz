import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useExchanges } from 'api';
import { Select } from 'shared/v1-components/Select';

export const ExchangeSelect: FC<{
  value?: string[];
  onChange?: (newValue?: string[]) => void;
  className?: string;
}> = ({ value, className, onChange }) => {
  const exchanges = useExchanges({
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
      loading={exchanges.isLoading}
      allowClear
      showSearch
      searchValue={query}
      onSearch={setQuery}
      multiple
      render={val => {
        if (!val) return t('common.all_exchanges');
        const exchange = exchanges.data?.find(x => x.name === val);
        if (!exchange) return val;
        return (
          <span>
            {exchange.icon_url ? (
              <img
                src={exchange.icon_url}
                alt={exchange.name}
                className="me-2 inline-block size-4 rounded-full bg-white align-middle"
              />
            ) : (
              <span className="me-2 inline-block size-4 rounded-full bg-white align-middle" />
            )}
            {exchange.name}
          </span>
        );
      }}
      options={
        exchanges.data
          ?.filter(x => x.name.toLowerCase().includes(query.toLowerCase()))
          .map(x => x.name)
          .filter(x => !!x) ?? []
      }
    />
  );
};
