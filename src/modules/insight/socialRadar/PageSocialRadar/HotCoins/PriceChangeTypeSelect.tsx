import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonSelect } from 'shared/ButtonSelect';

export type PriceChangeType = 'all' | 'loser' | 'gainer';

export const PriceChangeTypeSelect: FC<{
  value: PriceChangeType;
  onChange: (newValue: PriceChangeType) => void;
}> = ({ value, onChange }) => {
  const { t } = useTranslation('social-radar');

  return (
    <ButtonSelect
      value={value}
      onChange={onChange}
      options={[
        {
          label: t('hot-coins-section.filters.all-coins'),
          value: 'all',
        },
        {
          label: t('hot-coins-section.filters.gainers'),
          value: 'gainer',
        },
        {
          label: t('hot-coins-section.filters.losers'),
          value: 'loser',
        },
      ]}
    />
  );
};
