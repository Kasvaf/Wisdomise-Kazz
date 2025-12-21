import { type Tooltip as AntTooltip, Tooltip } from 'antd';
import { clsx } from 'clsx';
import type { ComponentProps, ReactNode } from 'react';

export function HoverTooltip({
  title,
  children,
  disabled,
  onOpenChange,
  className,
  rootClassName,
  placement,
}: {
  title?: ReactNode;
  children?: ReactNode;
  placement?: ComponentProps<typeof AntTooltip>['placement']; // DEPRECATED
  disabled?: boolean;
  onOpenChange?: (v: boolean) => void;
  ignoreFocus?: boolean;
  className?: string;
  rootClassName?: string;
}) {
  if (disabled) {
    return <>{children}</>;
  }
  return (
    <>
      <Tooltip
        arrow={false}
        autoAdjustOverflow
        className={className}
        onOpenChange={onOpenChange}
        placement={placement}
        rootClassName={clsx(
          '!max-w-[450px] p-3 text-v1-content-primary [&_.ant-tooltip-inner]:!bg-v1-surface-l1 border border-white/10 rounded-lg',
          rootClassName,
        )}
        title={title}
      >
        {children}
      </Tooltip>
    </>
  );
}
