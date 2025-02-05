import { bxSearch } from 'boxicons-quasar';
import { type ComponentProps, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import { Input } from 'shared/v1-components/Input';

export const CoinSearchInput: FC<
  Omit<
    ComponentProps<typeof Input<'string'>>,
    'type' | 'placeholder' | 'prefixIcon'
  >
> = ({ ...props }) => {
  const { t } = useTranslation('coin-radar');
  return (
    <Input
      type="string"
      placeholder={t('common.search_coin')}
      prefixIcon={<Icon name={bxSearch} />}
      {...props}
    />
  );
};
