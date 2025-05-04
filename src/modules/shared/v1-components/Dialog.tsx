import { clsx } from 'clsx';
import {
  type CSSProperties,
  type FC,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useDebounce } from 'usehooks-ts';
import { bxX } from 'boxicons-quasar';
import { type Surface, useSurface } from 'utils/useSurface';
import Icon from 'shared/Icon';
import { useComponentsContext } from './ComponentsProvider';

export const DIALOG_OPENER_CLASS = 'custom-popover';

const useTransition = (value: boolean, timeout: number) => {
  const shortDebounce = useDebounce(value, 25);
  const longDebounce = useDebounce(value, timeout);
  const [state, setState] = useState<boolean | null>(value);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      const nextState =
        value === (value ? shortDebounce : longDebounce) ? value : null;
      setState(prev => (prev === nextState ? prev : nextState));
    });
    return () => cancelAnimationFrame(animationFrame);
  }, [value, shortDebounce, longDebounce]);

  return state;
};

export const usePopupPosition = (
  target: RefObject<HTMLDivElement>,
  enabled: boolean,
  calculateBy?: 'target' | 'pointer',
) => {
  const context = useComponentsContext();
  if (!context) throw new Error('use Dialog inside ComponentsProvider');
  const [style, setStyle] = useState<CSSProperties>({});
  useEffect(() => {
    if (!enabled) return;

    const computeStyle = () => {
      const popupRect = target.current?.getBoundingClientRect();
      const pointerPosition = context.getPointerPosition();

      const anchorRect = context.getLastClickRect(`.${DIALOG_OPENER_CLASS}`);

      const margin = 8;
      const style: CSSProperties = {};

      if (!popupRect) return style;

      const preferredTop =
        (calculateBy === 'target'
          ? anchorRect?.top ?? pointerPosition.top
          : pointerPosition.top) +
        (calculateBy === 'target' ? anchorRect?.height ?? 0 : 0) +
        margin;

      if (preferredTop + popupRect.height <= window.innerHeight) {
        style.top = preferredTop;
      } else {
        style.bottom =
          window.innerHeight -
          (calculateBy === 'target'
            ? anchorRect?.top ?? pointerPosition.top
            : pointerPosition.top) +
          margin;
      }

      // Horizontal centering
      let left =
        (calculateBy === 'target'
          ? anchorRect?.left ?? pointerPosition.left
          : pointerPosition.left) +
        (calculateBy === 'target' ? (anchorRect?.width ?? 0) / 2 : 0) -
        popupRect.width / 2;

      // Adjust if it overflows
      if (left < margin) {
        left = margin + 16;
      } else if (left + popupRect.width + margin > window.innerWidth) {
        left = window.innerWidth - popupRect.width - margin - 16;
      }

      style.left = left;

      setStyle(style);
    };

    computeStyle();
    window.addEventListener('resize', computeStyle);
    return () => window.removeEventListener('resize', computeStyle);
  }, [calculateBy, context, enabled, target]);

  return style;
};

export const Dialog: FC<{
  open?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  closable?: boolean;
  children?: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  surface?: Surface;
  className?: string;
  contentClassName?: string;
  overlay?: boolean;
  mode?: 'popup' | 'modal' | 'drawer';
  popupConfig?: {
    position?: 'target' | 'pointer';
  };
  modalConfig?: {
    closeButton?: boolean;
  };
  drawerConfig?: {
    position?: 'bottom' | 'start' | 'end';
    closeButton?: boolean;
  };
}> = ({
  children,
  open: isOpen = false,
  onClose,
  onOpen,
  mode = 'popup',
  closable = true,
  className,
  contentClassName,

  surface = 3,

  header,
  footer,

  overlay = true,

  popupConfig,
  modalConfig,
  drawerConfig,
}) => {
  const root = useRef<HTMLDivElement>(null);
  const colors = useSurface(surface);
  const state = useTransition(isOpen, 250);
  const lastFocus = useRef<HTMLElement | null>(null);

  const popupPosition = usePopupPosition(
    root,
    (state === true || (isOpen && state === null)) && mode === 'popup',
    popupConfig?.position ?? 'target',
  );

  const toggle = useCallback(
    (newValue?: boolean) => {
      if (newValue === false) {
        onClose?.();
      } else {
        onOpen?.();
      }
    },
    [onClose, onOpen],
  );

  useEffect(() => {
    if (mode !== 'popup' || !isOpen || !closable) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          toggle?.(false);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mode, isOpen, closable, toggle]);

  useEffect(() => {
    if (isOpen) {
      lastFocus.current = document.activeElement as HTMLElement | null;
    } else if (lastFocus.current) {
      lastFocus.current?.focus?.({
        preventScroll: true,
      });
    }
  }, [isOpen]);

  return (
    <>
      {state === false
        ? null
        : createPortal(
            <>
              {overlay && (
                <div
                  className={clsx(
                    'fixed inset-0 z-[9999] transition-all duration-300',
                    mode === 'popup'
                      ? 'bg-transparent'
                      : 'bg-black/40 backdrop-blur-sm',
                    state ? 'opacity-100' : 'opacity-0',
                  )}
                  onClick={e => {
                    e.stopPropagation();
                    e.preventDefault();
                    toggle(false);
                  }}
                />
              )}
              <div
                ref={root}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex, jsx-a11y/tabindex-no-positive
                tabIndex={1}
                className={clsx(
                  'fixed z-[9999] overflow-auto bg-[--current-color] transition-[transform,opacity] duration-300 ease-in-out scrollbar-thin',
                  mode === 'drawer' && [
                    drawerConfig?.position === 'bottom' && [
                      'inset-x-0 bottom-0 h-auto max-h-[90svh] min-h-32 w-full rounded-t-2xl',
                      state ? 'translate-y-0' : 'translate-y-full',
                    ],
                    drawerConfig?.position === 'start' && [
                      'inset-y-0 start-0 h-full max-w-[40vw] rounded-e-2xl',
                      state ? 'translate-x-0' : '-translate-x-full',
                    ],
                    drawerConfig?.position === 'end' && [
                      'inset-y-0 end-0 h-full max-w-[40vw] rounded-s-2xl',
                      state ? 'translate-x-0' : 'translate-x-full',
                    ],
                  ],
                  mode === 'modal' && [
                    'left-1/2 top-1/2 h-auto max-h-[90svh] max-w-[90svw] -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl',
                    state ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
                  ],
                  mode === 'popup' && [
                    'max-h-[90svh] max-w-[90svw] rounded-xl shadow-xl',
                    state ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
                  ],
                  className,
                )}
                style={{
                  ...(mode === 'popup' && popupPosition),
                  ['--current-color' as never]: colors.current,
                }}
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <div className="sticky top-0 z-10 flex w-full flex-col items-center gap-3 bg-[--current-color] bg-gradient-to-b p-3 empty:hidden">
                  {mode === 'drawer' &&
                    drawerConfig?.closeButton !== false &&
                    drawerConfig?.position === 'bottom' && (
                      <div
                        className="h-[6px] w-full max-w-12 shrink-0 rounded-full bg-white opacity-60 hover:opacity-100 active:opacity-100"
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggle(false);
                        }}
                      />
                    )}
                  {((mode === 'modal' && modalConfig?.closeButton !== false) ||
                    (mode === 'drawer' &&
                      drawerConfig?.position !== 'bottom' &&
                      drawerConfig?.closeButton !== false)) && (
                    <button
                      className={clsx(
                        'absolute end-3 top-3 z-50 size-5 opacity-60 hover:opacity-100 active:opacity-100',
                      )}
                      onClick={() => toggle(false)}
                    >
                      <Icon name={bxX} size={20} />
                    </button>
                  )}
                  {header && header}
                </div>
                <div className={contentClassName}>{children}</div>
                {footer && (
                  <div className="sticky bottom-0 z-10 w-full bg-[--current-color] p-3 empty:hidden">
                    {footer}
                  </div>
                )}
              </div>
            </>,
            document.body,
          )}
    </>
  );
};
