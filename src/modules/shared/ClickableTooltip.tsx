import { type Drawer as AntDrawer, type Tooltip as AntTooltip } from 'antd';
import { clsx } from 'clsx';
import {
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { bxChevronDown } from 'boxicons-quasar';
import useIsMobile from 'utils/useIsMobile';
import { Dialog, DIALOG_OPENER_CLASS } from './v1-components/Dialog';
import Icon from './Icon';

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
            name={bxChevronDown}
            className={clsx(
              'text-inherit opacity-70 transition-all group-hover:opacity-100',
              isOpen && 'rotate-180 !opacity-100',
            )}
            size={16}
          />
        )}
      </span>
      <Dialog
        className="min-w-[150px] !max-w-[410px] mobile:!max-w-full md:border border-white/10"
        contentClassName="p-3"
        mode={isMobile ? 'drawer' : 'popup'}
        popupConfig={{
          position: 'target',
        }}
        drawerConfig={{
          position: 'bottom',
          closeButton: true,
        }}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        surface={1}
      >
        {title}
      </Dialog>
    </>
  );
}
