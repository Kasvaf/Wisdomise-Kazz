import type { Drawer as AntDrawer, Tooltip as AntTooltip } from 'antd';
import { bxChevronDown } from 'boxicons-quasar';
import { clsx } from 'clsx';
import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import useIsMobile from 'utils/useIsMobile';
import Icon from './Icon';
import { DIALOG_OPENER_CLASS, Dialog } from './v1-components/Dialog';

export function ClickableTooltip({
  title,
  children,
  className,
  disabled,
  onOpenChange,
  chevron,
}: {
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  tooltipPlacement?: ComponentProps<typeof AntTooltip>['placement']; // DEPRICATED
  drawerPlacement?: ComponentProps<typeof AntDrawer>['placement']; // DEPRICATED
  disabled?: boolean;
  onOpenChange?: (v: boolean) => void;
  chevron?: boolean;
}) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  return (
    <>
      <span
        className={clsx(
          'group relative inline-flex select-none items-center gap-1',
          disabled !== true && 'cursor-help',
          DIALOG_OPENER_CLASS,
          className,
        )}
        onClick={e => {
          if (!disabled) {
            e.stopPropagation();
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        {children}{' '}
        {disabled !== true && chevron !== false && (
          <Icon
            className={clsx(
              'text-inherit opacity-70 transition-all group-hover:opacity-100',
              isOpen && '!opacity-100 rotate-180',
            )}
            name={bxChevronDown}
            size={16}
          />
        )}
      </span>
      <Dialog
        className="!max-w-[410px] max-md:!max-w-full min-w-[150px] border-white/10 md:border"
        contentClassName="p-3"
        drawerConfig={{
          position: 'bottom',
          closeButton: true,
        }}
        mode={isMobile ? 'drawer' : 'popup'}
        onClose={() => setIsOpen(false)}
        open={isOpen}
        popupConfig={{
          position: 'target',
        }}
        surface={1}
      >
        {title}
      </Dialog>
    </>
  );
}
