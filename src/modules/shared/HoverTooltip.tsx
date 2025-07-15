import { type Tooltip as AntTooltip } from 'antd';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { clsx } from 'clsx';
import { Dialog, DIALOG_OPENER_CLASS } from './v1-components/Dialog';

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
        open={open}
        mode="popup"
        className="!max-w-[400px]"
        contentClassName="p-3 text-sm text-v1-content-primary"
        surface={4}
        onClose={() => onOpenChange?.(false)}
        onOpen={() => onOpenChange?.(true)}
        popupConfig={{
          position: 'pointer',
        }}
        overlay={false}
        ignoreFocus={ignoreFocus}
      >
        {title}
      </Dialog>
    </>
  );
}
