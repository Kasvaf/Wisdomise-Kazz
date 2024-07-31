import { type SwitchProps } from 'antd';
import { type FC } from 'react';
import { type AlertState } from 'api/alert';
import { Toggle } from 'shared/Toggle';

export const AlertStateInput: FC<
  Omit<SwitchProps, 'checked' | 'onChange'> & {
    value?: AlertState;
    onChange?: (newValue: AlertState) => void;
  }
> = ({ value, onChange, ...props }) => {
  return (
    <Toggle
      onChange={newValue => onChange?.(newValue ? 'ACTIVE' : 'DISABLED')}
      checked={value !== 'DISABLED'}
      {...props}
    />
  );
};
