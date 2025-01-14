import { bxChevronLeft, bxChevronRight } from 'boxicons-quasar';
import { clsx } from 'clsx';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Icon from 'shared/Icon';

export function ButtonSelect<T>({
  size = 'xl',
  className,
  itemsClassName,
  options,
  value,
  onChange,
}: {
  size?: 'xs' | 'sm' | 'md' | 'xl';
  className?: string;
  itemsClassName?: string;
  options: Array<{
    value: T;
    label: ReactNode;
    disabled?: boolean;
    hidden?: boolean;
  }>;
  value?: T;
  onChange?: (newValue: T) => void;
}) {
  const buttonsRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState<[boolean, boolean]>([
    false,
    false,
  ] as const);
  const scroll = useCallback(
    (direction: 'left' | 'right') => () => {
      buttonsRef.current?.scrollTo({
        left:
          buttonsRef.current.scrollLeft +
          buttonsRef.current.offsetWidth * (direction === 'left' ? -1 : 1) -
          20,
        behavior: 'smooth',
      });
    },
    [],
  );
  useEffect(() => {
    const el = buttonsRef.current;
    if (!el) return;
    const resizeHandler = () => {
      setHasOverflow(
        el
          ? [el.scrollLeft > 0, el.offsetWidth + el.scrollLeft < el.scrollWidth]
          : [false, false],
      );
    };
    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    el.addEventListener('scroll', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
      el.removeEventListener('scroll', resizeHandler);
    };
  }, []);
  return (
    <div
      className={clsx(
        'bg-v1-surface-l-next',
        'relative max-w-full overflow-hidden',
        /* Size: height, padding, font-size, border-radius */
        size === 'xs' && 'h-xs rounded-md text-xs',
        size === 'sm' && 'h-sm rounded-lg text-xs',
        size === 'md' && 'h-md rounded-lg text-xs',
        size === 'xl' && 'h-xl rounded-xl text-sm',
        className,
      )}
    >
      <div
        className="h-full w-full space-x-1 overflow-auto whitespace-nowrap p-1 text-v1-content-primary"
        ref={buttonsRef}
      >
        {options
          .filter(x => !x.hidden)
          .map((option, index) => (
            <button
              onClick={() => onChange?.(option.value)}
              key={`${option.value?.toString() || ''}-${index}`}
              role="radio"
              aria-checked={value === option.value}
              disabled={option.disabled}
              className={clsx(
                'h-full rounded-lg px-3 text-sm text-white/60',
                'grow transition-colors duration-150',
                'enabled:hover:bg-white/5 enabled:aria-checked:bg-white/5',
                'aria-checked:text-v1-content-primary',
                'disabled:opacity-40',
                itemsClassName,
              )}
            >
              {option.label}
            </button>
          ))}
      </div>
      {hasOverflow.map((x, i) => (
        <div
          className={clsx(
            'absolute top-0 flex h-full w-6 items-center justify-center backdrop-blur-lg',
            i === 0 ? 'left-0 rounded-l-xl' : 'right-0 rounded-r-xl',
            !x && 'hidden',
          )}
          onClick={scroll(i === 0 ? 'left' : 'right')}
          key={i}
        >
          <Icon
            name={i === 0 ? bxChevronLeft : bxChevronRight}
            className="text-white/70"
          />
        </div>
      ))}
    </div>
  );
}
