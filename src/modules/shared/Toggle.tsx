import { Switch, type SwitchProps } from 'antd';
import { clsx } from 'clsx';
import { type FC } from 'react';

export const Toggle: FC<SwitchProps> = ({ className, ...props }) => (
  <Switch
    className={clsx(
      '!duration-0 [&.ant-switch-checked_.ant-switch-inner]:!bg-[#9747FF]',
      className,
    )}
    {...props}
  />
);
