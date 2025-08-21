import { bxChevronLeft, bxChevronRight } from 'boxicons-quasar';
import { clsx } from 'clsx';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Icon from 'shared/Icon';
import { useMutationObserver } from 'utils/useMutationObserver';
import { type Surface, useSurface } from 'utils/useSurface';

export function ButtonSelect<T>({
  size = 'xl',
  variant = 'default',
  className,
  buttonClassName,
  options,
  value,
  onChange,
  surface = 2,
  innerScroll = true,
}: {
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'xl';
  variant?: 'default' | 'primary' | 'white' | 'tab';
  className?: string;
  buttonClassName?: string;
  options: Array<{
    value: T;
    label: ReactNode;
    disabled?: boolean;
    hidden?: boolean;
    onClickCapture?: () => void;
    className?: string;
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

  const updateInnerScrollBtnsLastCall = useRef<number>(-1);
  const updateInnerScrollBtns = useCallback(() => {
    const el = buttonsRef.current;
    if (
      !el ||
      !innerScroll ||
      updateInnerScrollBtnsLastCall.current === el.scrollWidth
    )
      return;
    updateInnerScrollBtnsLastCall.current = el.scrollWidth;
    setHasOverflow(
      el
        ? [el.scrollLeft > 0, el.offsetWidth + el.scrollLeft < el.scrollWidth]
        : [false, false],
    );
  }, [innerScroll]);

  useMutationObserver(buttonsRef, updateInnerScrollBtns, {
    childList: true,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
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
        size === 'xxs' && 'h-5 rounded-md text-xxs',
        size === 'xs' && 'h-xs rounded-md text-xxs',
        size === 'sm' && 'h-sm rounded-lg text-xs',
        size === 'md' && 'h-md rounded-lg text-xs',
        size === 'xl' && 'h-xl rounded-xl text-sm',
        variant === 'tab' && '!rounded-none',
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
          'flex h-full flex-nowrap items-center gap-0 whitespace-nowrap text-v1-content-primary',
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
              aria-checked={value === option.value}
              className={clsx(
                'relative h-full shrink-0 overflow-hidden',
                size === 'xl' ? 'px-3' : 'px-2',
                size === 'xxs' || size === 'xs' ? 'rounded-md' : 'rounded-lg',
                variant === 'tab' &&
                  '!rounded-none border-x-0 border-t-0 border-b',
                'inline-flex flex-nowrap items-center justify-center gap-1',
                'grow outline-none transition-colors duration-150',
                'border border-transparent enabled:hover:text-v1-content-primary/80',
                variant === 'primary'
                  ? 'aria-checked:text-v1-content-primary enabled:aria-checked:bg-v1-background-brand enabled:aria-checked:text-v1-content-primary-inverse'
                  : variant === 'white'
                    ? 'enabled:aria-checked:bg-v1-content-primary enabled:aria-checked:text-v1-content-primary-inverse'
                    : variant === 'tab'
                      ? 'border-v1-content-primary/10 enabled:aria-checked:border-v1-background-brand enabled:aria-checked:text-v1-content-brand'
                      : 'aria-checked:text-v1-content-primary enabled:aria-checked:bg-(--active-color)',
                'focus-visible:border-v1-border-focus',
                'disabled:opacity-40',
                buttonClassName,
                option.className,
              )}
              disabled={option.disabled}
              key={`${option.value?.toString() || ''}-${index}`}
              onClick={handleClick(option)}
              role="radio"
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
                  ? 'left-0 justify-start from-(--current-color) to-transparent'
                  : 'right-0 justify-end from-transparent to-(--current-color)',
                !x && 'hidden',
              )}
              key={i}
              onClick={scroll(i === 0 ? 'left' : 'right')}
            >
              <Icon
                className="text-v1-content-primary opacity-60 group-hover:opacity-100"
                name={i === 0 ? bxChevronLeft : bxChevronRight}
                size={20}
              />
            </div>
          ))
        : null}
    </div>
  );
}
