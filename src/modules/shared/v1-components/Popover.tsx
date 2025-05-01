import { clsx } from 'clsx';
import {
  type CSSProperties,
  type FC,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useDebounce } from 'usehooks-ts';
import { type Surface, useSurface } from 'utils/useSurface';

const useTransition = (value: boolean, timeout: number) => {
  const shortDebounce = useDebounce(value, 50);
  const longDebounce = useDebounce(value, timeout);
  const [state, setState] = useState<boolean | null>(value);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      return setState(
        value === (value ? shortDebounce : longDebounce) ? value : null,
      );
    });
    return () => cancelAnimationFrame(animationFrame);
  }, [value, shortDebounce, longDebounce]);

  return state;
};

const usePopupPosition = (
  target: RefObject<HTMLDivElement>,
  enabled: boolean,
) => {
  const anchor = useRef<HTMLElement>();
  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    const handler = (event: Event) => {
      const originalTarget = (event.target ||
        event.currentTarget) as HTMLElement | null;
      let target = originalTarget;
      while (target) {
        if (target.matches?.('button, a, input, .custom-popover')) break;
        target = target.parentElement;
      }
      target = target || originalTarget;
      anchor.current = target || undefined;
    };
    document.addEventListener('pointerenter', handler);
    document.addEventListener('pointerdown', handler);
    document.addEventListener('focusin', handler);
    return () => {
      document.removeEventListener('pointerenter', handler);
      document.removeEventListener('pointerdown', handler);
      document.removeEventListener('focusin', handler);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const targetRect = target.current?.getBoundingClientRect();
    const anchorRect = anchor.current?.getBoundingClientRect();

    if (targetRect && anchorRect) {
      const margin = 16;
      const style: CSSProperties = {};

      const spaceBelow = window.innerHeight - anchorRect.bottom;
      const spaceAbove = anchorRect.top;

      // Vertical positioning
      if (spaceBelow >= targetRect.height + margin) {
        // Place below anchor using `top`
        style.top = anchorRect.bottom + margin;
      } else if (spaceAbove >= targetRect.height + margin) {
        // Place above anchor using `bottom`
        style.bottom = window.innerHeight - anchorRect.top + margin;
      } else {
        // Not enough space above or below — pick the side with more space
        if (spaceBelow >= spaceAbove) {
          style.top = Math.min(
            anchorRect.bottom + margin,
            window.innerHeight - targetRect.height - margin,
          );
        } else {
          style.bottom = Math.max(
            window.innerHeight - anchorRect.top + margin,
            margin,
          );
        }
      }

      // Horizontal positioning: center over anchor
      let left = anchorRect.left + anchorRect.width / 2 - targetRect.width / 2;
      left = Math.max(
        margin,
        Math.min(left, window.innerWidth - targetRect.width - margin),
      );
      style.left = left;

      setStyle(style);
    }
  }, [target, anchor, enabled]);

  return style;
};

export const Popover: FC<{
  open?: boolean;
  onClose?: () => void;
  closable?: boolean;
  children?: ReactNode;
  mode?: 'popup' | 'modal' | 'start-drawer' | 'end-drawer' | 'bottomsheet';
  surface?: Surface;
  className?: string;
}> = ({
  children,
  open = false,
  onClose,
  mode = 'popup',
  closable = true,
  className,
  surface = 3,
}) => {
  const root = useRef<HTMLDivElement>(null);
  const colors = useSurface(surface);
  const state = useTransition(open || false, 300);
  const popupPosition = usePopupPosition(
    root,
    (state === true || (open && state === null)) && mode === 'popup',
  );

  useEffect(() => {
    if (mode !== 'popup' || !open) return;
    if (closable) {
      const handler = () => onClose?.();
      window.addEventListener('scroll', handler, { passive: true });
      return () => window.removeEventListener('scroll', handler);
    }
  }, [mode, open, onClose, closable]);

  const popover = (
    <div
      ref={root}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex, jsx-a11y/tabindex-no-positive
      tabIndex={1}
      className={clsx(
        'fixed z-50 transition-[transform,opacity] duration-300 ease-in-out',
        mode === 'bottomsheet' && [
          'inset-x-0 bottom-0 max-h-[90svh] w-full rounded-t-2xl',
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
          'h-auto max-h-[90svh] w-auto max-w-[90svw] rounded-2xl shadow-2xl',
          state ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
        ],
        className,
      )}
      style={{
        ...(mode === 'popup' && popupPosition),
        backgroundColor: colors.current,
      }}
    >
      {children}
    </div>
  );

  const overlay = (
    <div
      className={clsx(
        'fixed inset-0 z-50 transition-all duration-300',
        mode === 'popup' ? 'bg-transparent' : 'bg-black/40 backdrop-blur-sm',
        state ? 'opacity-100' : 'opacity-0',
      )}
      onClick={() => {
        if (closable) {
          onClose?.();
        }
      }}
    />
  );

  return createPortal(
    <>
      {(state === true || state === null) && (
        <>
          {overlay}
          {popover}
        </>
      )}
    </>,
    document.body,
  );
};
