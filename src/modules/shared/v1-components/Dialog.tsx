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

const useLastHoverPosition = (
  target: RefObject<HTMLDivElement>,
  enabled: boolean,
) => {
  const lastHover = useRef<HTMLElement | null>(null);
  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    const handler = (event: Event) => {
      lastHover.current = event.target as HTMLElement | null;
    };

    document.addEventListener('pointerover', handler);
    return () => {
      document.removeEventListener('pointerover', handler);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const computeStyle = () => {
      let anchor = lastHover.current;
      while (anchor) {
        if (anchor.matches?.(`.${DIALOG_OPENER_CLASS}`)) break;
        anchor = anchor.parentElement;
      }

      const targetRect = target.current?.getBoundingClientRect();
      const anchorRect = anchor?.getBoundingClientRect();
      if (!targetRect || !anchorRect) return;

      const vMargin = 8;
      const hMargin = 8;
      const style: CSSProperties = {};

      const spaceBelow = window.innerHeight - anchorRect.bottom;
      const spaceAbove = anchorRect.top;

      // Vertical positioning
      if (spaceBelow >= targetRect.height + vMargin) {
        style.top = anchorRect.bottom + vMargin;
      } else if (spaceAbove >= targetRect.height + vMargin) {
        style.bottom = window.innerHeight - anchorRect.top + vMargin;
      } else {
        if (spaceBelow >= spaceAbove) {
          style.top = Math.min(
            anchorRect.bottom + vMargin,
            window.innerHeight - targetRect.height - vMargin,
          );
        } else {
          style.bottom = Math.max(
            window.innerHeight - anchorRect.top + vMargin,
            vMargin,
          );
        }
      }

      const spaceRight = window.innerWidth - anchorRect.left;
      const spaceLeft = anchorRect.right;

      const centeredLeft =
        anchorRect.left + anchorRect.width / 2 - targetRect.width / 2;
      const fitsCentered =
        centeredLeft >= hMargin &&
        centeredLeft + targetRect.width <= window.innerWidth - hMargin;

      if (fitsCentered) {
        style.left = centeredLeft;
      } else if (spaceRight >= targetRect.width + hMargin) {
        style.left = anchorRect.left;
      } else if (spaceLeft >= targetRect.width + hMargin) {
        style.right = window.innerWidth - anchorRect.right;
      } else {
        style.left = Math.max(
          hMargin,
          Math.min(
            centeredLeft,
            window.innerWidth - targetRect.width - hMargin,
          ),
        );
      }

      setStyle(style);
    };

    computeStyle();
    window.addEventListener('resize', computeStyle);
    return () => window.removeEventListener('resize', computeStyle);
  }, [enabled, target]);

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
}) => {
  const root = useRef<HTMLDivElement>(null);
  const colors = useSurface(surface);
  const state = useTransition(isOpen, 250);

  const popupPosition = useLastHoverPosition(
    root,
    (state === true || (isOpen && state === null)) && mode === 'popup',
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
                    'h-auto max-h-[90svh] w-auto max-w-[90svw] rounded-2xl shadow-xl',
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
