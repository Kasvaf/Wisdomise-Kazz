import type { ComponentProps, FC } from 'react';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';

export const XTrackerTabSelect: FC<
  Omit<ComponentProps<typeof ButtonSelect<'edit' | 'view'>>, 'options'>
> = props => (
  <ButtonSelect
    options={[
      {
        label: 'Customize Feed',
        value: 'edit',
      },
      {
        label: 'X Feed',
        value: 'view',
      },
    ]}
    {...props}
  />
);
