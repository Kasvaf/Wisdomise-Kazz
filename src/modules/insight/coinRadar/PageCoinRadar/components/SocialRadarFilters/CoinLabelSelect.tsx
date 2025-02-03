import { type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type CoinLabels, useCoinLabels } from 'api';
import { Select } from 'shared/v1-components/Select';
import { CoinLabel } from 'shared/CoinLabels';

export const CoinLabelSelect: FC<{
  value?: string[];
  onChange?: (newValue?: string[]) => void;
  className?: string;
  type: keyof CoinLabels;
}> = ({ value, className, onChange, type }) => {
  const { t } = useTranslation('coin-radar');
  const labels = useCoinLabels();

  return (
    <Select
      className={className}
      block
      value={value}
      loading={labels.isLoading}
      allowClear
      multiple
      onChange={onChange}
      render={(val, target) => {
        if (!val) return t('common.all_labels');
        return (
          <CoinLabel
            value={val}
            type={type}
            popup={false}
            className={clsx(target === 'value' && '!bg-transparent !px-0')}
          />
        );
      }}
      options={labels.data?.[type]?.filter(x => !!x) ?? []}
    />
  );
};
