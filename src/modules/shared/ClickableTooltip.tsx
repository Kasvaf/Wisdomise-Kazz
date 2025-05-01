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
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import useIsMobile from 'utils/useIsMobile';
import Icon from './Icon';

export function ClickableTooltip({
  title,
  children,
  className,
  tooltipClassName,
  tooltipPlacement = 'bottom',
  drawerPlacement = 'bottom',
  disabled,
  onOpenChange,
  chevron,
}: {
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  tooltipClassName?: string;
  tooltipPlacement?: ComponentProps<typeof AntTooltip>['placement'];
  drawerPlacement?: ComponentProps<typeof AntDrawer>['placement'];
  disabled?: boolean;
  onOpenChange?: (v: boolean) => void;
  chevron?: boolean;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);
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
    'max-h-[90svh] overflow-auto text-sm text-v1-content-primary',
  );
  const titleRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(titleRef, () => {
    if (isOpen && !isMobile) {
      setIsOpen(false);
    }
  });
  useEventListener('click', e => {
    const el = e.target as HTMLElement;
    if (el.closest('a')) {
      setIsOpen(false);
    }
  });
  useEffect(() => {
    const rootEl = rootRef.current;
    const titleEl = titleRef.current;

    let newState: boolean | null = null;

    let timeout: ReturnType<typeof setTimeout> | null = null;
    const run = () => {
      if (timeout !== null) clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!disabled && newState !== null) setIsOpen(newState);
      }, 100);
    };

    let watchBlur = false;
    const handleOpen = () => {
      newState = true;
      watchBlur = true;
      run();
    };

    const handleClose = () => {
      if (watchBlur) {
        newState = false;
        run();
      }
    };

    rootEl?.addEventListener('click', handleOpen);
    titleEl?.addEventListener('click', handleOpen);
    rootEl?.addEventListener('focusin', handleOpen);
    titleEl?.addEventListener('focusin', handleOpen);
    rootEl?.addEventListener('focusout', handleClose);
    titleEl?.addEventListener('focusout', handleClose);

    return () => {
      rootEl?.removeEventListener('click', handleOpen);
      titleEl?.removeEventListener('click', handleOpen);
      rootEl?.removeEventListener('focusin', handleOpen);
      titleEl?.removeEventListener('focusin', handleOpen);
      rootEl?.removeEventListener('focusout', handleClose);
      titleEl?.removeEventListener('focusout', handleClose);
    };
  }, [disabled]);

  useEffect(() => {
    if (isOpen !== lastIsOpen.current) {
      onOpenChange?.(isOpen);
      lastIsOpen.current = isOpen;
    }
  }, [isOpen, onOpenChange]);

  const root = (
    <span ref={rootRef} className={rootClassName}>
      {children}
      {disabled !== true && chevron !== false && (
        <Icon
          name={bxChevronDown}
          className={clsx(
            'text-inherit opacity-70 transition-all group-hover:opacity-100',
            isOpen && 'rotate-180 !opacity-100',
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
            className="rounded-t-2xl !bg-v1-surface-l4 !p-6 mobile:!p-4 [&_.ant-drawer-body]:!p-0 [&_.ant-drawer-header]:hidden"
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
          rootClassName={clsx(
            'min-w-[150px] !max-w-[400px] [&_.ant-tooltip-arrow]:hidden [&_.ant-tooltip-inner]:rounded-xl [&_.ant-tooltip-inner]:!bg-v1-surface-l4 [&_.ant-tooltip-inner]:!p-3 [&_.ant-tooltip-inner]:!text-inherit',
            tooltipClassName,
          )}
          open={isOpen}
          destroyTooltipOnHide
        >
          {root}
        </AntTooltip>
      )}
    </>
  );
}
