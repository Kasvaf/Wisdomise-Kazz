import { bxChevronDown, bxLoader } from 'boxicons-quasar';
import { clsx } from 'clsx';
import {
  Fragment,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Icon from 'shared/Icon';
import useIsMobile from 'utils/useIsMobile';
import { type Surface, useSurface } from 'utils/useSurface';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { DIALOG_OPENER_CLASS, Dialog } from './Dialog';

interface SelectProps<V, M extends boolean = false> {
  size?: 'xs' | 'sm' | 'md' | 'xl';

  value?: M extends true ? V[] : V;
  onChange?: (newValue: M extends true ? V[] : V | undefined) => void;

  showSearch?: boolean;
  searchValue?: string;
  onSearch?: (newSearchValue: string) => void;

  multiple?: M;

  chevron?: boolean;

  options?: V[];

  render?: (item: V | undefined, target: 'option' | 'value') => ReactNode;

  allowClear?: boolean;

  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  placeholder?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  className?: string;

  dialogClassName?: string;
  dialogSurface?: Surface;

  surface?: Surface;

  searchPlaceholder?: string;
}

function InternalRenderedValue<V>({
  value,
  render,
  target,
}: Pick<SelectProps<never, false>, 'render' | 'loading' | 'size'> & {
  value?: V;
  target: 'option' | 'value';
}) {
  const renderFn = useMemo(
    () =>
      render ??
      ((v => <>{v}</>) as NonNullable<SelectProps<V, false>['render']>),
    [render],
  );
  return (
    <Fragment key={JSON.stringify(value)}>
      {renderFn(value as never, target)}
    </Fragment>
  );
}

const RenderedValue = memo(
  InternalRenderedValue,
  (p, n) =>
    p.target === n.target &&
    p.value === n.value &&
    p.loading === n.loading &&
    p.size === n.size,
);

function Option({
  children,
  size,
  onClick,
  selected,
  checkbox,
}: {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  size: 'xs' | 'sm' | 'md' | 'xl';
  checkbox?: boolean;
}) {
  const childRef = useRef<HTMLDivElement>(null);
  return (
    <div
      aria-selected={selected}
      className={clsx(
        /* Size: height, padding, font-size, border-radius */
        size === 'xs' && 'min-h-xs px-2 text-xs',
        size === 'sm' && 'min-h-sm px-2 text-xs',
        size === 'md' && 'min-h-md px-3 text-xs',
        size === 'xl' && 'min-h-xl px-3 text-sm',
        'group flex shrink-0 flex-nowrap items-center justify-between gap-1 max-md:px-3',
        'cursor-pointer hover:bg-white/5',
        !checkbox && selected && '!bg-white/10',
      )}
      onClick={onClick}
      onPointerLeave={() => {
        try {
          childRef.current?.scrollTo({
            left: 0,
            behavior: 'smooth',
          });
        } catch {}
      }}
      onPointerOver={() => {
        try {
          childRef.current?.scrollTo({
            left: 999,
            behavior: 'smooth',
          });
        } catch {}
      }}
    >
      <div className="w-full overflow-hidden" ref={childRef}>
        {children}
      </div>
      {checkbox && (
        <Checkbox
          className="shrink-0 overflow-visible"
          size={size === 'xl' ? 'lg' : 'md'}
          value={selected}
        />
      )}
    </div>
  );
}

function InnerContent<V, M extends boolean = false>({
  value,
  multiple,
  allowClear,
  placeholder,
  render,
  loading,
  size,
}: Pick<
  SelectProps<V, M>,
  | 'value'
  | 'multiple'
  | 'allowClear'
  | 'placeholder'
  | 'render'
  | 'loading'
  | 'size'
>) {
  const isEmpty = useMemo(
    () =>
      value === undefined ||
      (multiple && Array.isArray(value) && value.length === 0),
    [value, multiple],
  );

  return (
    <>
      {isEmpty ? (
        allowClear ? (
          <RenderedValue
            loading={loading}
            render={render}
            size={size}
            target="value"
            value={undefined}
          />
        ) : (
          <span className="text-v1-content-secondary">{placeholder}</span>
        )
      ) : multiple ? (
        <div className="flex items-center gap-3 overflow-hidden">
          {(value as V[]).slice(0, 1).map(v => (
            <span
              className="shrink-0 rounded-full bg-white/5 p-px px-2"
              key={JSON.stringify(v)}
            >
              <RenderedValue
                loading={loading}
                render={render}
                size={size}
                target="value"
                value={v}
              />
            </span>
          ))}
          {(value as V[]).length - 1 > 0 && `+${(value as V[]).length - 1}`}
        </div>
      ) : (
        <RenderedValue
          loading={loading}
          render={render}
          size={size}
          target="value"
          value={value as never}
        />
      )}
    </>
  );
}

export function Select<V, M extends boolean = false>({
  size = 'xl',
  value,
  onChange,
  showSearch,
  searchValue,
  onSearch,
  multiple,
  allowClear = false,
  options,
  render,
  loading,
  block,
  placeholder,
  className,
  prefixIcon,
  suffixIcon,
  chevron = true,
  disabled,
  surface = 1,
  dialogSurface = 1,
  dialogClassName,
  searchPlaceholder = 'Search Here',
}: SelectProps<V, M>) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const colors = useSurface(surface);

  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) onSearch?.('');
    if (isOpen) {
      const focusTimeout = setTimeout(() => {
        if (searchRef.current && !isMobile) {
          searchRef.current?.focus();
        }
      }, 100);
      return () => {
        clearTimeout(focusTimeout);
      };
    }
  }, [isOpen, isMobile, onSearch]);

  const valueAsArray = useMemo(
    () => (value === undefined ? [] : multiple ? value : [value]) as V[],
    [value, multiple],
  );

  const handleOptionClick = useCallback(
    (opt: V | undefined) => {
      const isClearing = opt === undefined;
      if (multiple) {
        if (isClearing) {
          onChange?.([] as never);
        } else {
          const prevValue = (value as V[]) ?? [];
          const currentIndex = prevValue.indexOf(opt);
          if (currentIndex === -1) {
            onChange?.([...prevValue, opt] as never);
          } else {
            onChange?.([
              ...prevValue.slice(0, currentIndex),
              ...prevValue.slice(currentIndex + 1),
            ] as never);
          }
        }
      } else {
        setIsOpen(false);
        onChange?.((isClearing ? undefined : opt) as never);
      }
    },
    [multiple, onChange, value],
  );

  const renderFn = useMemo(
    () =>
      render ??
      ((v: V | undefined) => <>{v === undefined ? placeholder : v}</>),
    [placeholder, render],
  );

  const visibleOptions = useMemo(() => {
    let result: Array<V | undefined> = [];
    if (allowClear) {
      result = [...result, undefined];
    }

    if (!searchValue) {
      result = [...result, ...valueAsArray];
    }

    result = [...result, ...(options ?? [])];

    result = result.filter((opt, i, self) => self.lastIndexOf(opt) === i);

    return result;
  }, [allowClear, options, searchValue, valueAsArray]);

  return (
    <>
      <div
        className={clsx(
          /* Size: height, padding, font-size, border-radius */
          size === 'xs' && 'h-xs rounded-md px-3 text-xs',
          size === 'sm' && 'h-sm rounded-lg px-3 text-xs',
          size === 'md' && 'h-md rounded-lg px-3 text-xs',
          size === 'xl' && 'h-xl rounded-xl px-4 text-sm',
          /* Disabled */
          'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-none disabled:bg-white/5 disabled:text-white/50 disabled:grayscale',
          /* Shared */
          'select-none border border-transparent font-normal outline-none transition-all focus:border-v1-border-focus [&_svg]:size-5',
          block ? 'flex' : 'inline-flex',
          'items-center justify-between gap-1 overflow-hidden',
          !disabled && 'cursor-pointer',
          DIALOG_OPENER_CLASS,
          className,
        )}
        style={{
          backgroundColor: colors.current,
        }}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        {...(!disabled && {
          tabIndex: 0,
        })}
        onClick={() => (disabled ? null : setIsOpen(true))}
        ref={contentRef}
      >
        {prefixIcon}
        <div className="relative shrink grow truncate">
          <InnerContent
            allowClear={allowClear}
            loading={loading}
            multiple={multiple}
            placeholder={placeholder}
            render={renderFn}
            size={size}
            value={value}
          />
        </div>
        {suffixIcon}
        {chevron && !disabled && (
          <Icon
            className={clsx(
              'justify-self-end text-inherit opacity-70 transition-all group-hover:opacity-100',
              isOpen && '!opacity-100 rotate-180',
            )}
            name={bxChevronDown}
            size={16}
          />
        )}
      </div>

      <Dialog
        className={clsx(
          '!max-h-96 max-md:!max-h-[90svh] border-white/10 md:border',
          showSearch && 'max-md:!min-h-[90svh]',
          dialogClassName,
        )}
        drawerConfig={{
          closeButton: true,
          position: 'bottom',
        }}
        footer={
          isMobile &&
          !showSearch && (
            <Button
              block
              className="w-full"
              onClick={() => setIsOpen(false)}
              surface={5}
              variant="ghost"
            >
              {'OK'}
            </Button>
          )
        }
        header={
          showSearch && (
            <input
              className="block h-sm w-full rounded-lg border border-transparent bg-v1-surface-l2 p-3 text-xs outline-none focus:border-v1-border-brand max-md:h-md"
              onChange={e => onSearch?.(e.target.value)}
              placeholder={searchPlaceholder}
              ref={searchRef}
              value={searchValue ?? ''}
            />
          )
        }
        mode={isMobile ? 'drawer' : 'popup'}
        onClose={() => setIsOpen(false)}
        open={isOpen}
        popupConfig={{
          position: 'target',
        }}
        surface={dialogSurface}
      >
        <div
          className={clsx('flex h-full w-full flex-col overflow-hidden')}
          ref={titleRef}
          tabIndex={-1}
        >
          <div className="relative flex shrink grow flex-col gap-px overflow-auto">
            {loading ? (
              <div
                className="flex min-h-12 items-center justify-center"
                key="loading"
              >
                <Icon
                  className="inline-block size-4 animate-spin"
                  name={bxLoader}
                  size={16}
                />
              </div>
            ) : (
              visibleOptions.map((opt, index) => (
                <Option
                  checkbox={multiple}
                  key={`${JSON.stringify(opt)}${index}`}
                  onClick={() => handleOptionClick(opt)}
                  selected={
                    opt === undefined
                      ? valueAsArray.length === 0
                      : valueAsArray.includes(opt)
                  }
                  size={size}
                >
                  <RenderedValue
                    loading={loading}
                    render={render}
                    size={size}
                    target="option"
                    value={opt}
                  />
                </Option>
              ))
            )}
          </div>
          {}
        </div>
      </Dialog>
    </>
  );
}
