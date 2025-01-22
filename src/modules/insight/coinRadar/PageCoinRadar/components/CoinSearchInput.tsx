import { bxSearch } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import { Input } from 'shared/v1-components/Input';

export function CoinSearchInput({
  value,
  className,
  onChange,
}: {
  value?: string;
  className?: string;
  onChange?: (v: string) => void;
}) {
  const { t } = useTranslation('coin-radar');
  return (
    <Input
      type="string"
      value={value ?? ''}
      onChange={onChange}
      placeholder={t('common.search_coin')}
      className={className}
      prefixIcon={<Icon name={bxSearch} />}
    />
  );
}
