import { useTranslation } from 'react-i18next';
import { type AlertState } from 'api/alert';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';

export function AlertStateSelect({
  value,
  onChange,
  className,
}: {
  value?: AlertState;
  onChange?: (newValue: AlertState | undefined) => void;
  className?: string;
}) {
  const { t } = useTranslation('alerts');
  return (
    <ButtonSelect
      value={value}
      options={[
        {
          label: t('common.all'),
          value: undefined,
        },
        {
          label: t('common.active'),
          value: 'ACTIVE' as AlertState,
        },
        {
          label: t('common.disabled'),
          value: 'DISABLED' as AlertState,
        },
      ]}
      onChange={newValue => onChange?.(newValue)}
      className={className}
      size="md"
      surface={2}
    />
  );
}
