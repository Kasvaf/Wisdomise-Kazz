import { bxSearch } from 'boxicons-quasar';
import { type ComponentProps, type FC } from 'react';
import Icon from 'shared/Icon';
import { Input } from 'shared/v1-components/Input';

export const SearchInput: FC<
  Omit<ComponentProps<typeof Input<'string'>>, 'type' | 'prefixIcon'>
> = ({ ...props }) => (
  <Input type="string" prefixIcon={<Icon name={bxSearch} />} {...props} />
);
