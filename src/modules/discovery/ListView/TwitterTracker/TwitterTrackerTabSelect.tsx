import { type ComponentProps, type FC } from 'react';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';

export const TwitterTrackerTabSelect: FC<
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
