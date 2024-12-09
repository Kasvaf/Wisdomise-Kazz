import { type ScatterConfig } from '@ant-design/plots';
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
  if (disabled) {
    return <>{children}</>;
  }
  return (
    <AntTooltip
      title={title}
      placement={placement}
      rootClassName="!max-w-[400px] [&_.ant-tooltip-inner]:rounded-xl [&_.ant-tooltip-inner]:!bg-v1-surface-l4 [&_.ant-tooltip-arrow]:hidden [&_.ant-tooltip-inner]:!p-3 [&_.ant-tooltip-inner]:!text-inherit [&_.ant-tooltip-inner]:!text-sm [&_.ant-tooltip-inner]:text-v1-content-primary"
      onOpenChange={onOpenChange}
      destroyTooltipOnHide
    >
      {children}
    </AntTooltip>
  );
}

export const antChartTooltipConfig: ScatterConfig['tooltip'] = {
  domStyles: {
    'g2-tooltip': {
      padding: '0.5rem',
      borderRadius: '8px',
      boxShadow: 'none',
      background: '#282a32', // TODO v1-surface-l4
      color: '#ffffff', // TODO v1-content-primary
      lineHeight: 1.4,
    },
  },
};
