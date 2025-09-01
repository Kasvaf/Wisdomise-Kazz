import { type Tooltip as AntTooltip, Tooltip } from 'antd';
import { clsx } from 'clsx';
import type { ComponentProps, ReactNode } from 'react';
import { DIALOG_OPENER_CLASS } from './v1-components/Dialog';

export function HoverTooltip({
  title,
  children,
  disabled,
  onOpenChange,
  className,
}: {
  title?: ReactNode;
  children?: ReactNode;
  placement?: ComponentProps<typeof AntTooltip>['placement']; // DEPRECATED
  disabled?: boolean;
  onOpenChange?: (v: boolean) => void;
  ignoreFocus?: boolean;
  className?: string;
}) {
  if (disabled) {
    return <>{children}</>;
  }
  return (
    <>
      <Tooltip
        arrow={false}
        autoAdjustOverflow
        onOpenChange={onOpenChange}
        rootClassName="!max-w-[450px] p-3 text-sm text-v1-content-primary [&_.ant-tooltip-inner]:!bg-v1-surface-l0"
        title={title}
      >
        <span className={clsx('cursor-help', DIALOG_OPENER_CLASS, className)}>
          {children}
        </span>
      </Tooltip>
    </>
  );
}
