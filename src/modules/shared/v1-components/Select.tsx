import { clsx } from 'clsx';
import {
  useMemo,
  useRef,
  useState,
  type ReactNode,
  useCallback,
  useEffect,
  Fragment,
  memo,
  type ComponentProps,
} from 'react';
import { Tooltip as AntTooltip, Drawer as AntDrawer } from 'antd';
import { bxChevronDown, bxLoader, bxX } from 'boxicons-quasar';
import Icon from 'shared/Icon';
import useIsMobile from 'utils/useIsMobile';
import { type Surface, useSurface } from 'utils/useSurface';
import { Button } from './Button';
import { Checkbox } from './Checkbox';

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

  tooltipPlacement?: ComponentProps<typeof AntTooltip>['placement'];

  allowClear?: boolean;

  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  placeholder?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  className?: string;

  surface?: Surface;
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
  return (
    <div
      className={clsx(
        /* Size: height, padding, font-size, border-radius */
        size === 'xs' && 'h-xs px-2 text-xs',
        size === 'sm' && 'h-sm px-2 text-xs',
        size === 'md' && 'h-md px-3 text-xs',
        size === 'xl' && 'h-xl px-3 text-sm',
        'group flex shrink-0 flex-nowrap items-center justify-between gap-4 mobile:px-5',
        'hover:bg-white/5',
        !checkbox && selected && '!bg-white/10',
      )}
      onClick={onClick}
      aria-selected={selected}
    >
      <div className="max-w-80 overflow-hidden">{children}</div>
      {checkbox && (
        <Checkbox
          size={size === 'xl' ? 'lg' : 'md'}
          value={selected}
          className="shrink-0 overflow-visible"
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
            value={undefined}
            render={render}
            target="value"
            loading={loading}
            size={size}
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
                value={v}
                render={render}
                target="value"
                loading={loading}
                size={size}
              />
            </span>
          ))}
          {(value as V[]).length - 1 > 0 && `+${(value as V[]).length - 1}`}
        </div>
      ) : (
        <RenderedValue
          value={value as never}
          render={render}
          target="value"
          loading={loading}
          size={size}
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
  tooltipPlacement = 'bottomLeft',
  disabled,
  surface = 3,
}: SelectProps<V, M>) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const colors = useSurface(surface);

  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) onSearch?.('');
    if (isOpen && searchRef.current && !isMobile) {
      searchRef.current.focus();
    }
    if (isOpen) {
      const blurHandler = (e: FocusEvent) => {
        if (
          !contentRef.current?.contains(e?.relatedTarget as never) &&
          !titleRef.current?.contains(e?.relatedTarget as never)
        ) {
          setIsOpen(false);
        }
      };
      window.addEventListener('focusout', blurHandler);
      return () => {
        window.removeEventListener('focusout', blurHandler);
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
        onChange?.((isClearing ? undefined : opt) as never);
        setIsOpen(false);
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

  const popupContent = useMemo(() => {
    return (
      <div
        className={clsx(
          'flex h-full w-full flex-col overflow-hidden',
          showSearch ? 'mobile:h-[96svh]' : 'max-h-[60svh]',
        )}
        ref={titleRef}
        tabIndex={-1}
      >
        {showSearch && (
          <div className="flex items-center gap-2 p-4">
            <input
              placeholder="Search Here"
              className="block h-sm w-full rounded-lg border border-transparent bg-v1-surface-l5 p-3 text-xs outline-none focus:border-v1-border-brand mobile:h-md"
              value={searchValue ?? ''}
              onChange={e => onSearch?.(e.target.value)}
              ref={searchRef}
            />
            {isMobile && (
              <Button
                variant="ghost"
                size="md"
                className="w-md"
                surface={5}
                onClick={() => setIsOpen(false)}
              >
                <Icon name={bxX} />
              </Button>
            )}
          </div>
        )}
        <div className="relative flex max-h-48 shrink grow flex-col gap-px overflow-auto mobile:max-h-none">
          {loading ? (
            <div
              className="flex min-h-12 items-center justify-center"
              key="loading"
            >
              <Icon
                name={bxLoader}
                className="inline-block size-4 animate-spin"
                size={16}
              />
            </div>
          ) : (
            <>
              {visibleOptions.map(opt => (
                <Option
                  key={JSON.stringify(opt)}
                  size={size}
                  onClick={() => handleOptionClick(opt)}
                  selected={
                    opt === undefined
                      ? valueAsArray.length === 0
                      : valueAsArray.includes(opt)
                  }
                  checkbox={multiple}
                >
                  <RenderedValue
                    value={opt}
                    render={render}
                    target="option"
                    loading={loading}
                    size={size}
                  />
                </Option>
              ))}
            </>
          )}
        </div>
        {isMobile && !showSearch && (
          <div className="p-4">
            <Button
              variant="ghost"
              block
              className="w-full"
              surface={5}
              onClick={() => setIsOpen(false)}
            >
              <Icon name={bxX} /> {'OK'}
            </Button>
          </div>
        )}
      </div>
    );
  }, [
    showSearch,
    searchValue,
    isMobile,
    loading,
    visibleOptions,
    onSearch,
    size,
    valueAsArray,
    multiple,
    render,
    handleOptionClick,
  ]);

  const rootContent = useMemo(
    () => (
      <div
        className={clsx(
          /* Size: height, padding, font-size, border-radius */
          size === 'xs' && 'h-xs rounded-md px-3 text-xs',
          size === 'sm' && 'h-sm rounded-lg px-3 text-xs',
          size === 'md' && 'h-md rounded-lg px-3 text-xs',
          size === 'xl' && 'h-xl rounded-xl px-4 text-sm',
          /* Disabled */
          'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-white/5 disabled:bg-none disabled:text-white/50 disabled:grayscale',
          /* Shared */
          'select-none border border-transparent font-normal outline-none transition-all focus:border-v1-border-focus [&_svg]:size-5',
          block ? 'flex' : 'inline-flex',
          'items-center justify-between gap-1 overflow-hidden',
          !disabled && 'cursor-pointer',
          className,
        )}
        style={{
          backgroundColor: colors.current,
        }}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        {...(!disabled && {
          tabIndex: 0,
        })}
        ref={contentRef}
        onClick={() => (disabled ? null : setIsOpen(p => !p))}
      >
        {prefixIcon}
        <div className="shrink grow truncate">
          <InnerContent
            allowClear={allowClear}
            multiple={multiple}
            render={renderFn}
            placeholder={placeholder}
            value={value}
            loading={loading}
            size={size}
          />
        </div>
        {suffixIcon}
        {chevron && !disabled && (
          <Icon
            name={bxChevronDown}
            className={clsx(
              'justify-self-end text-inherit opacity-70 transition-all group-hover:opacity-100',
              isOpen && 'rotate-180 !opacity-100',
            )}
            size={16}
          />
        )}
      </div>
    ),
    [
      size,
      block,
      disabled,
      className,
      colors,
      prefixIcon,
      allowClear,
      multiple,
      renderFn,
      placeholder,
      value,
      loading,
      suffixIcon,
      chevron,
      isOpen,
    ],
  );

  return isMobile ? (
    <>
      {rootContent}
      <AntDrawer
        closable
        placement="bottom"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="!rounded-t-2xl !bg-v1-surface-l4 text-v1-content-primary [&_.ant-drawer-body]:!p-0 [&_.ant-drawer-content-wrapper]:h-full [&_.ant-drawer-header]:hidden"
        destroyOnClose
        height="auto"
      >
        {popupContent}
      </AntDrawer>
    </>
  ) : (
    <AntTooltip
      placement={tooltipPlacement}
      title={popupContent}
      rootClassName={clsx(
        'w-auto text-v1-content-primary',
        '[&_.ant-tooltip-arrow]:hidden',
        '[&_.ant-tooltip-inner]:rounded-xl [&_.ant-tooltip-inner]:!bg-v1-surface-l4 [&_.ant-tooltip-inner]:!text-inherit',
        '[&_.ant-tooltip-inner]:overflow-hidden [&_.ant-tooltip-inner]:!p-0',
        '[&_.ant-tooltip-inner]:w-max [&_.ant-tooltip-inner]:min-w-56 [&_.ant-tooltip-inner]:max-w-96',
        '[&_.ant-tooltip-content]:w-full [&_.ant-tooltip-content]:overflow-visible',
      )}
      open={isOpen}
      destroyTooltipOnHide
    >
      {rootContent}
    </AntTooltip>
  );
}
