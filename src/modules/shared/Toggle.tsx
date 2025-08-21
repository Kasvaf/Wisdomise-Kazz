import { Switch, type SwitchProps } from 'antd';
import { clsx } from 'clsx';
import type { FC } from 'react';

export const Toggle: FC<SwitchProps & { variant?: 'brand' | 'secondary' }> = ({
  variant = 'brand',
  className,
  ...props
}) => (
  <Switch
    className={clsx(
      '!duration-0 [&.ant-switch-handle::before]:!bg-black',
      variant === 'secondary' &&
        '[&.ant-switch-checked_.ant-switch-inner]:!bg-v1-background-secondary',
      variant === 'brand' &&
        '[&.ant-switch-checked_.ant-switch-inner]:!bg-v1-background-brand',
      className,
    )}
    size="small"
    {...props}
  />
);
