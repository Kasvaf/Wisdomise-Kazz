import { Input, type InputProps } from 'antd';
import { clsx } from 'clsx';
import type { FC } from 'react';

export const PriceInput: FC<InputProps> = ({
  className,
  children: _,
  ...props
}) => (
  <Input
    className={clsx(
      'h-[46px] rounded-xl border-black/20 bg-black/20',
      className,
    )}
    defaultValue={'0'}
    type="number"
    {...props}
  />
);
