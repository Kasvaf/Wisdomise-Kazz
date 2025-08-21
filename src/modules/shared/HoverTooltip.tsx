import type { Tooltip as AntTooltip } from 'antd';
import { clsx } from 'clsx';
import { type ComponentProps, type ReactNode, useState } from 'react';
import { DIALOG_OPENER_CLASS, Dialog } from './v1-components/Dialog';

export function HoverTooltip({
  title,
  children,
  disabled,
  onOpenChange,
  ignoreFocus,
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
  const [open, setOpen] = useState(false);
  if (disabled) {
    return <>{children}</>;
  }
  return (
    <>
      <span
        className={clsx('cursor-help', DIALOG_OPENER_CLASS, className)}
        onMouseEnter={() => {
          setOpen(true);
        }}
        onMouseLeave={() => {
          setOpen(false);
        }}
      >
        {children}
      </span>
      <Dialog
        className="!max-w-[400px] border-white/10 md:border"
        contentClassName="p-3 text-sm text-v1-content-primary"
        ignoreFocus={ignoreFocus}
        mode="popup"
        onClose={() => onOpenChange?.(false)}
        onOpen={() => onOpenChange?.(true)}
        open={open}
        overlay={false}
        popupConfig={{
          position: 'pointer',
        }}
        surface={1}
      >
        {title}
      </Dialog>
    </>
  );
}
