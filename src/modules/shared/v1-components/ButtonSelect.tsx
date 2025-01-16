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

export function ButtonSelect<T, AC extends boolean = false>({
  size = 'xl',
  variant = 'default',
  className,
  buttonClassName,
  options,
  allowClear,
  value,
  onChange,
}: {
  size?: 'xs' | 'sm' | 'md' | 'xl';
  variant?: 'default' | 'primary';
  className?: string;
  buttonClassName?: string;
  allowClear?: AC;
  options: Array<{
    value: T;
    label: ReactNode;
    disabled?: boolean;
    hidden?: boolean;
  }>;
  value?: T;
  onChange?: (newValue: AC extends true ? T | undefined : T) => void;
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

  useEffect(() => {
    const el = buttonsRef.current;
    if (!el) return;
    const selectedEl = el.querySelector<HTMLButtonElement>(
      '[aria-checked="true"]',
    );
    if (!selectedEl) return;
    el.scrollTo({
      left: selectedEl.offsetLeft - el.offsetWidth / 2,
      behavior: 'smooth',
    });
  }, [value]);

  const handleClick = useCallback(
    (newValue: T) => () => {
      onChange?.(
        allowClear
          ? value === newValue
            ? (undefined as never)
            : newValue
          : newValue,
      );
    },
    [onChange, allowClear, value],
  );
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
        className="flex h-full w-full flex-nowrap items-center gap-1 overflow-hidden whitespace-nowrap p-1 text-v1-content-primary mobile:overflow-auto"
        ref={buttonsRef}
      >
        {options
          .filter(x => !x.hidden)
          .map((option, index) => (
            <button
              onClick={handleClick(option.value)}
              key={`${option.value?.toString() || ''}-${index}`}
              role="radio"
              aria-checked={value === option.value}
              disabled={option.disabled}
              className={clsx(
                'relative h-full shrink-0 overflow-hidden rounded-lg px-3 text-sm',
                'inline-flex flex-nowrap items-center justify-center gap-1',
                'grow transition-colors duration-150',
                'enabled:hover:bg-white/5 enabled:active:bg-white/10',
                variant === 'primary'
                  ? 'enabled:aria-checked:bg-v1-background-brand'
                  : 'enabled:aria-checked:bg-white/10',
                'aria-checked:text-v1-content-primary',
                'disabled:opacity-40',
                buttonClassName,
              )}
            >
              {option.label}
            </button>
          ))}
      </div>
      {hasOverflow.map((x, i) => (
        <div
          className={clsx(
            'group absolute top-0 flex h-full w-5 cursor-pointer items-center justify-center',
            'bg-v1-surface-l-next',
            i === 0 ? 'left-0' : 'right-0',
            !x && 'hidden',
          )}
          onClick={scroll(i === 0 ? 'left' : 'right')}
          key={i}
        >
          <Icon
            name={i === 0 ? bxChevronLeft : bxChevronRight}
            className="text-v1-content-primary opacity-60 group-hover:opacity-100"
            size={20}
          />
        </div>
      ))}
    </div>
  );
}
