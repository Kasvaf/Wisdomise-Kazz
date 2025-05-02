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
import { type Surface, useSurface } from 'utils/useSurface';

export function ButtonSelect<T>({
  size = 'xl',
  variant = 'default',
  className,
  buttonClassName,
  options,
  value,
  onChange,
  surface = 3,
  innerScroll = true,
}: {
  size?: 'xs' | 'sm' | 'md' | 'xl';
  variant?: 'default' | 'primary';
  className?: string;
  buttonClassName?: string;
  options: Array<{
    value: T;
    label: ReactNode;
    disabled?: boolean;
    hidden?: boolean;
    onClickCapture?: () => void;
  }>;
  value?: T;
  onChange?: (newValue: T) => void;
  innerScroll?: boolean;
  surface?: Surface;
}) {
  const buttonsRef = useRef<HTMLDivElement>(null);
  const colors = useSurface(surface);
  const [hasOverflow, setHasOverflow] = useState<[boolean, boolean]>([
    false,
    false,
  ] as const);
  const scroll = useCallback(
    (direction: 'left' | 'right') => () => {
      buttonsRef.current?.scrollTo({
        left:
          buttonsRef.current.scrollLeft +
          (buttonsRef.current.offsetWidth / 3) *
            (direction === 'left' ? -1 : 1),
        behavior: 'smooth',
      });
    },
    [],
  );
  useEffect(() => {
    const el = buttonsRef.current;
    if (!el || !innerScroll) return;
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
  }, [innerScroll]);

  useEffect(() => {
    const el = buttonsRef.current;
    if (!el) return;
    const selectedEl = el.querySelector<HTMLButtonElement>(
      '[aria-checked="true"]',
    );
    el.scrollTo({
      left: selectedEl ? selectedEl.offsetLeft - el.offsetWidth / 2 : 0,
      behavior: 'smooth',
    });
  }, [value]);

  const handleClick = useCallback(
    (option: (typeof options)[number]) => () => {
      if (typeof option.onClickCapture === 'function') {
        option.onClickCapture();
      } else {
        onChange?.(option.value);
      }
    },
    [onChange],
  );
  return (
    <div
      className={clsx(
        'relative overflow-hidden',
        innerScroll ? 'max-w-full' : 'w-max min-w-max max-w-max',
        /* Size: height, padding, font-size, border-radius */
        size === 'xs' && 'h-xs rounded-md text-xxs',
        size === 'sm' && 'h-sm rounded-lg text-xxs',
        size === 'md' && 'h-md rounded-lg text-xs',
        size === 'xl' && 'h-xl rounded-xl text-sm',
        className,
      )}
      style={{
        backgroundColor: colors.current,
        ['--current-color' as never]: colors.current,
        ['--active-color' as never]: colors.next,
      }}
    >
      <div
        className={clsx(
          'flex h-full flex-nowrap items-center gap-0  whitespace-nowrap text-v1-content-primary ',
          innerScroll
            ? ['scrollbar-none', 'w-full overflow-auto']
            : 'w-max min-w-max shrink-0',
        )}
        ref={buttonsRef}
      >
        {options
          .filter(x => !x.hidden)
          .map((option, index) => (
            <button
              onClick={handleClick(option)}
              key={`${option.value?.toString() || ''}-${index}`}
              role="radio"
              aria-checked={value === option.value}
              disabled={option.disabled}
              className={clsx(
                'relative h-full shrink-0 overflow-hidden rounded-lg text-sm',
                size === 'xl' ? ' px-3' : 'px-2',
                'inline-flex flex-nowrap items-center justify-center gap-1',
                'grow outline-none transition-colors duration-150',
                'border border-transparent enabled:hover:text-v1-content-primary/80',
                variant === 'primary'
                  ? 'enabled:aria-checked:bg-v1-background-brand'
                  : 'enabled:aria-checked:bg-[--active-color]',
                'focus-visible:border-v1-border-focus',
                'aria-checked:!text-v1-content-primary',
                'disabled:opacity-40',
                buttonClassName,
              )}
            >
              {option.label}
            </button>
          ))}
      </div>
      {innerScroll
        ? hasOverflow.map((x, i) => (
            <div
              className={clsx(
                'group absolute top-0 flex h-full w-10 cursor-pointer items-center',
                '!bg-gradient-to-r',
                i === 0
                  ? 'left-0 justify-start from-[--current-color] to-transparent'
                  : 'right-0 justify-end from-transparent to-[--current-color]',
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
          ))
        : null}
    </div>
  );
}
