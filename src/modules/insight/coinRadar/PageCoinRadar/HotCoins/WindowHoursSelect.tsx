import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonSelect } from 'shared/ButtonSelect';

export const WindowHoursSelect: FC<{
  value: number;
  onChange: (newValue: number) => void;
}> = ({ value, onChange }) => {
  const { t } = useTranslation('coin-radar');

  return (
    <ButtonSelect
      value={value}
      onChange={onChange}
      options={[
        {
          label: t('hot-coins-section.filters.24h'),
          value: 24,
        },
        {
          label: t('hot-coins-section.filters.7d'),
          value: 24 * 7,
        },
        {
          label: t('hot-coins-section.filters.30d'),
          value: 24 * 30,
        },
      ]}
    />
  );
};
