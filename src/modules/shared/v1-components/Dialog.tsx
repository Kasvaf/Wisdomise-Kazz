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
import { type Surface, useSurface } from 'utils/useSurface';
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
  // TODOOOO
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
  mode?: 'popup' | 'modal' | 'start-drawer' | 'end-drawer' | 'bottomsheet';
  surface?: Surface;
  className?: string;
  overlay?: boolean;
  calculatePopupPositonBy?: 'target' | 'pointer';
}> = ({
  children,
  open: isOpen = false,
  onClose,
  onOpen,
  mode = 'popup',
  closable = true,
  className,
  surface = 3,
  footer,
  overlay = true,
  calculatePopupPositonBy = 'target',
}) => {
  const root = useRef<HTMLDivElement>(null);
  const colors = useSurface(surface);
  const state = useTransition(isOpen, 250);
  const lastFocus = useRef<HTMLElement | null>(null);

  const popupPosition = usePopupPosition(
    root,
    (state === true || (isOpen && state === null)) && mode === 'popup',
    calculatePopupPositonBy,
  );

  const toggle = useCallback(
    (newValue?: boolean) => {
      if (newValue === false) {
        if (lastFocus.current) {
          lastFocus.current?.focus?.();
        }
        onClose?.();
      } else {
        lastFocus.current = document.activeElement as HTMLElement | null;
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
                    toggle(false);
                  }}
                />
              )}
              <div
                ref={root}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex, jsx-a11y/tabindex-no-positive
                tabIndex={1}
                className={clsx(
                  'fixed z-[9999] overflow-auto transition-[transform,opacity] duration-300 ease-in-out',
                  mode === 'bottomsheet' && [
                    'inset-x-0 bottom-0 h-auto max-h-[90svh] min-h-32 w-full rounded-t-2xl',
                    state ? 'translate-y-0' : 'translate-y-full',
                  ],
                  mode.includes('drawer') && [
                    'inset-y-0 h-full',
                    state && 'translate-x-0',
                    mode === 'start-drawer' && [
                      'start-0 rounded-e-2xl',
                      !state && '-translate-x-full',
                    ],
                    mode === 'end-drawer' && [
                      'end-0 rounded-s-2xl',
                      !state && 'translate-x-full',
                    ],
                  ],
                  mode === 'modal' && [
                    'left-1/2 top-1/2 h-auto max-h-[90svh] w-auto max-w-[90svw] -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl',
                    state ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
                  ],
                  mode === 'popup' && [
                    'h-auto max-h-[90svh] w-auto max-w-[90svw] rounded-xl shadow-xl',
                    state ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
                  ],
                )}
                style={{
                  ...(mode === 'popup' && popupPosition),
                  backgroundColor: colors.current,
                }}
              >
                {mode === 'bottomsheet' && (
                  <div
                    className="sticky left-1/2 top-3 z-50 mb-3 h-[6px] w-full max-w-12 shrink-0 -translate-x-1/2 rounded-full bg-white opacity-60 hover:opacity-100 active:opacity-100"
                    onPointerDown={() => toggle(false)}
                  />
                )}
                <div className={className}>{children}</div>
                {footer && (
                  <div className="sticky bottom-0 mt-3 h-auto w-full border-t border-t-white/10 bg-inherit p-3">
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
