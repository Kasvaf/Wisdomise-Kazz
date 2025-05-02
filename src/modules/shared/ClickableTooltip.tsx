// TODO refactor sources
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
  tooltipClassName,
  disabled,
  onOpenChange,
  chevron,
}: {
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  tooltipClassName?: string;
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
          isOpen && 'pointer-events-none',
          DIALOG_OPENER_CLASS,
          className,
        )}
        onClick={() => setIsOpen(p => !p)}
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
        className={clsx(
          'min-w-[150px] max-w-[400px] p-3 mobile:max-w-full',
          tooltipClassName,
        )}
        mode={isMobile ? 'bottomsheet' : 'popup'}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        surface={4}
      >
        {title}
      </Dialog>
    </>
  );
}
