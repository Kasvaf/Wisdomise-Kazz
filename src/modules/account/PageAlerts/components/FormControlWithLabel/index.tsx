import { clsx } from 'clsx';
import { bxInfoCircle } from 'boxicons-quasar';
import { type FC, type ReactNode } from 'react';
import { Tooltip } from 'antd';
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
        name={bxInfoCircle}
        size={16}
        className="inline-block align-middle text-v1-content-primary"
      />
    </Tooltip>
  );
  return (
    <>
      {type === 'normal' ? (
        <div className={clsx('space-y-2', className)}>
          <label className="inline-flex items-center gap-1 px-2 text-xs text-v1-content-primary">
            {label}
            {infoContent}
          </label>
          <div>{children}</div>
        </div>
      ) : type === 'box' ? (
        <div
          className={clsx(
            'mx-auto inline-flex items-center justify-center gap-4',
            'rounded-xl bg-v1-surface-l3 px-8 py-6 text-xs text-v1-content-primary',
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
            'inline-flex items-center justify-center gap-4 text-sm font-light',
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
