import { bxSearch } from 'boxicons-quasar';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import TextBox from 'shared/TextBox';

export const WalletInput: FC<{
  value?: string;
  onChange?: (newValue: string | undefined) => void;
  className?: string;
}> = ({ value, onChange, className }) => {
  const { t } = useTranslation('whale');

  return (
    <TextBox
      value={value ?? ''}
      onChange={v => onChange?.(v || undefined)}
      placeholder={t('sections.top-whales.filters.wallet')}
      suffix={<Icon name={bxSearch} size={20} />}
      className={className}
    />
  );
};
