import { bxSearch } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import TextBox from 'shared/TextBox';

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
    <TextBox
      value={value ?? ''}
      onChange={onChange}
      placeholder={t('common.search_coin')}
      className={className}
      inputClassName="text-sm"
      suffix={<Icon name={bxSearch} />}
    />
  );
}
