import { Tooltip as AntTooltip } from 'antd';
import { type ComponentProps, type ReactNode } from 'react';

export function HoverTooltip({
  title,
  children,
  placement = 'bottom',
  disabled,
  onOpenChange,
}: {
  title?: ReactNode;
  children?: ReactNode;
  placement?: ComponentProps<typeof AntTooltip>['placement'];
  disabled?: boolean;
  onOpenChange?: (v: boolean) => void;
}) {
  return (
    <AntTooltip
      title={title}
      placement={placement}
      rootClassName="!max-w-[400px] [&_.ant-tooltip-inner]:rounded-xl [&_.ant-tooltip-inner]:!bg-v1-surface-l4 [&_.ant-tooltip-arrow]:hidden [&_.ant-tooltip-inner]:!p-4 [&_.ant-tooltip-inner]:!text-inherit [&_.ant-tooltip-inner]:!text-sm [&_.ant-tooltip-inner]:text-v1-content-primary"
      open={disabled ? false : undefined}
      onOpenChange={onOpenChange}
      destroyTooltipOnHide
    >
      {children}
    </AntTooltip>
  );
}
