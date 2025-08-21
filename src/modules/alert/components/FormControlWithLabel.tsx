import { Tooltip } from 'antd';
import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import type { FC, ReactNode } from 'react';
import Icon from 'shared/Icon';

export const FormControlWithLabel: FC<{
  type?: 'normal' | 'box' | 'inline';
  children?: ReactNode;
  label?: ReactNode;
  className?: string;
  info?: ReactNode;
}> = ({ children, label, type = 'normal', className, info }) => {
  const infoContent = info && (
    <Tooltip title={info}>
      <Icon
        className="inline-block align-middle text-v1-content-primary"
        name={bxInfoCircle}
        size={16}
      />
    </Tooltip>
  );
  return (
    <>
      {type === 'normal' ? (
        <div className={clsx('space-y-2', className)}>
          {label && (
            <label className="inline-flex items-center gap-1 px-2 text-v1-content-primary text-xs">
              {label}
              {infoContent}
            </label>
          )}
          <div>{children}</div>
        </div>
      ) : type === 'box' ? (
        <div
          className={clsx(
            'mx-auto inline-flex items-center justify-center gap-4',
            'rounded-xl bg-v1-surface-l3 px-8 py-6 text-v1-content-primary text-xs',
            className,
          )}
        >
          {label}
          {infoContent}
          {children}
        </div>
      ) : (
        <div
          className={clsx(
            'inline-flex items-center justify-center gap-4 font-light text-sm',
            className,
          )}
        >
          {label && (
            <div className="inline-flex items-center justify-center gap-1 whitespace-nowrap">
              {label}
              {infoContent}
            </div>
          )}
          {children}
        </div>
      )}
    </>
  );
};
