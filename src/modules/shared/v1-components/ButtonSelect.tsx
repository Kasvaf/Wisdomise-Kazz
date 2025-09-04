import { clsx } from 'clsx';
import { type ReactNode, useCallback, useEffect, useRef } from 'react';
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
            ? 'scrollbar-none w-full overflow-auto'
            : 'w-max min-w-max shrink-0',
        )}
        ref={buttonsRef}
      >
        {options
          .filter(x => !x.hidden)
          .map((option, index) => (
            <div
              aria-checked={value === option.value}
              aria-disabled={option.disabled}
              className={clsx(
                'relative h-full shrink-0 overflow-hidden',
                size === 'xl' ? 'px-3' : 'px-2',
                size === 'xxs' || size === 'xs' ? 'rounded-md' : 'rounded-lg',
                variant === 'tab' &&
                  '!rounded-none border-x-0 border-t-0 border-b',
                'inline-flex flex-nowrap items-center justify-center gap-1',
                'grow outline-none transition-colors duration-150',
                'border border-transparent data-enabled:cursor-pointer data-enabled:hover:text-v1-content-primary/80',
                variant === 'primary'
                  ? 'aria-checked:text-v1-content-primary data-enabled:aria-checked:bg-v1-background-brand data-enabled:aria-checked:text-v1-content-primary-inverse'
                  : variant === 'white'
                    ? 'data-enabled:aria-checked:bg-v1-content-primary data-enabled:aria-checked:text-v1-content-primary-inverse'
                    : variant === 'tab'
                      ? 'border-v1-content-primary/10 data-enabled:aria-checked:border-v1-background-brand data-enabled:aria-checked:text-v1-content-brand'
                      : 'aria-checked:text-v1-content-primary data-enabled:aria-checked:bg-(--active-color)',
                'focus-visible:border-v1-border-focus',
                'aria-disabled:opacity-40',
                buttonClassName,
                option.className,
              )}
              {...(!option.disabled && {
                'data-enabled': true,
              })}
              key={`${option.value?.toString() || ''}-${index}`}
              onClick={handleClick(option)}
              role="radio"
              tabIndex={0}
            >
              {option.label}
            </div>
          ))}
      </div>
    </div>
  );
}
