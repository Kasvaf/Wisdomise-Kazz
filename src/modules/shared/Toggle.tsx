import { Switch, type SwitchProps } from 'antd';
import { clsx } from 'clsx';
import { type FC } from 'react';

export const Toggle: FC<SwitchProps & { variant?: 'brand' | 'secondary' }> = ({
  variant = 'secondary',
  className,
  ...props
}) => (
  <Switch
    className={clsx(
      '!duration-0',
      variant === 'secondary' &&
        '[&.ant-switch-checked_.ant-switch-inner]:!bg-v1-background-secondary',
      variant === 'brand' &&
        '[&.ant-switch-checked_.ant-switch-inner]:!bg-v1-background-brand',
      className,
    )}
    {...props}
  />
);
