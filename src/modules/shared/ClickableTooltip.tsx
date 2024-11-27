import { Drawer as AntDrawer, Tooltip as AntTooltip } from 'antd';
import { clsx } from 'clsx';
import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { bxChevronDown } from 'boxicons-quasar';
import { useOnClickOutside } from 'usehooks-ts';
import useIsMobile from 'utils/useIsMobile';
import Icon from './Icon';

export function ClickableTooltip({
  title,
  children,
  className,
  tooltipPlacement = 'bottom',
  drawerPlacement = 'bottom',
  disabled,
  onOpenChange,
  chevron,
}: {
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  tooltipPlacement?: ComponentProps<typeof AntTooltip>['placement'];
  drawerPlacement?: ComponentProps<typeof AntDrawer>['placement'];
  disabled?: boolean;
  onOpenChange?: (v: boolean) => void;
  chevron?: boolean;
}) {
  const isMobile = useIsMobile();
  const lastIsOpen = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const rootClassName = clsx(
    'group relative inline-flex select-none items-center gap-1',
    disabled !== true && 'cursor-help',
    isOpen && 'pointer-events-none',
    className,
  );
  const titleClassName = clsx(
    'max-h-[340px] overflow-auto text-sm text-v1-content-primary mobile:max-h-[50svh]',
  );
  const titleRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(titleRef, () => {
    if (isOpen && !isMobile) {
      setIsOpen(false);
    }
  });
  useEffect(() => {
    if (isOpen !== lastIsOpen.current) {
      onOpenChange?.(isOpen);
      lastIsOpen.current = isOpen;
    }
  }, [isOpen, onOpenChange]);

  const root = (
    <span
      className={rootClassName}
      onClick={() => {
        if (disabled !== true) {
          setIsOpen(p => !p);
        }
      }}
    >
      {children}
      {disabled !== true && chevron !== false && (
        <Icon
          name={bxChevronDown}
          className={clsx(
            'text-inherit opacity-70 transition-all group-hover:opacity-100',
            isOpen && '!opacity-100',
          )}
          size={16}
        />
      )}
    </span>
  );

  return (
    <>
      {isMobile ? (
        <>
          {root}
          <AntDrawer
            closable
            placement={drawerPlacement}
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="rounded-t-2xl !bg-v1-surface-l4 !p-6 [&_.ant-drawer-body]:!p-0 [&_.ant-drawer-header]:hidden"
            closeIcon={null}
            destroyOnClose
            height="auto"
          >
            <div ref={titleRef} className={titleClassName}>
              {title}
            </div>
          </AntDrawer>
        </>
      ) : (
        <AntTooltip
          title={
            <div ref={titleRef} className={titleClassName}>
              {title}
            </div>
          }
          placement={tooltipPlacement}
          rootClassName="!max-w-[400px] [&_.ant-tooltip-inner]:rounded-xl [&_.ant-tooltip-inner]:!bg-v1-surface-l4 [&_.ant-tooltip-arrow]:hidden [&_.ant-tooltip-inner]:!p-4 [&_.ant-tooltip-inner]:!text-inherit"
          open={isOpen}
          destroyTooltipOnHide
        >
          {root}
        </AntTooltip>
      )}
    </>
  );
}
