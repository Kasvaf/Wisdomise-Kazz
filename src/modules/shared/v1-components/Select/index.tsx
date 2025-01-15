import { clsx } from 'clsx';
import {
  useMemo,
  useRef,
  useState,
  type ReactNode,
  useCallback,
  useEffect,
} from 'react';
import { Tooltip as AntTooltip } from 'antd';
import { bxChevronDown } from 'boxicons-quasar';
import Icon from 'shared/Icon';
import { ReactComponent as CheckIcon } from './check.svg';
import { ReactComponent as UnCheckIcon } from './uncheck.svg';

interface SelectProps<V, M extends boolean = false> {
  size?: 'xs' | 'sm' | 'md' | 'xl';

  value?: M extends true ? V[] : V;
  onChange?: (newValue: M extends true ? V[] : V | undefined) => void;

  showSearch?: boolean;
  searchValue?: string;
  onSearch?: (newSearchValue: string) => void;

  multiple?: M;

  options: V[];

  render?: (item: V | undefined) => ReactNode;

  allowClear?: boolean;

  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  placeholder?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  className?: string;
}

function Checkbox({
  value,
  size,
  className,
}: Pick<SelectProps<never, never>, 'size' | 'className'> & {
  value?: boolean;
}) {
  const Component = value ? CheckIcon : UnCheckIcon;
  return (
    <Component
      className={clsx(size === 'xl' ? 'size-5' : 'size-4', className)}
    />
  );
}

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
        size === 'xs' && 'h-xs px-3 text-xs',
        size === 'sm' && 'h-sm px-3 text-xs',
        size === 'md' && 'h-md px-3 text-xs',
        size === 'xl' && 'h-xl px-4 text-sm',
        'group flex shrink-0 flex-nowrap items-center justify-between gap-2 rounded-lg',
        'hover:bg-white/5',
        !checkbox && selected && '!bg-white/10',
      )}
      onClick={onClick}
      aria-selected={selected}
      tabIndex={-1}
    >
      {children}
      {checkbox && <Checkbox size={size} value={selected} />}
    </div>
  );
}

function InnerContent<V, M extends boolean = false>({
  value,
  multiple,
  allowClear,
  placeholder,
  render,
}: Pick<
  SelectProps<V, M>,
  'value' | 'multiple' | 'allowClear' | 'placeholder' | 'render'
>) {
  const isEmpty = useMemo(
    () =>
      value === undefined ||
      (multiple && Array.isArray(value) && value.length === 0),
    [value, multiple],
  );
  const renderFn = useMemo(
    () =>
      render ??
      ((v: V | undefined) => <>{v === undefined ? placeholder : v}</>),
    [placeholder, render],
  );
  return (
    <>
      {isEmpty ? (
        allowClear ? (
          renderFn(undefined)
        ) : (
          <span className="text-v1-content-secondary">{placeholder}</span>
        )
      ) : multiple ? (
        <div className="flex items-center gap-1">
          {(value as V[]).slice(0, 2).map(v => (
            <span className="rounded bg-white/5 p-px" key={JSON.stringify(v)}>
              {renderFn(v)}
            </span>
          ))}
          {(value as V[]).length - 2 > 0 && `+${(value as V[]).length - 2}`}
        </div>
      ) : (
        renderFn(value as never)
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
}: SelectProps<V, M>) {
  const [isOpen, setIsOpen] = useState(false);

  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) onSearch?.('');
    if (isOpen && searchRef.current) {
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
  }, [isOpen, onSearch]);

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

  return (
    <AntTooltip
      placement="bottomLeft"
      title={
        <div className="w-full min-w-48" ref={titleRef}>
          {showSearch && (
            <input
              placeholder="Search Here"
              className="mb-4 block h-sm w-full rounded-lg border border-transparent bg-v1-surface-l3 p-3 text-xs outline-none focus:border-v1-border-brand"
              value={searchValue ?? ''}
              onChange={e => onSearch?.(e.target.value)}
              ref={searchRef}
            />
          )}
          <div
            className={clsx(
              'flex max-h-40 flex-col gap-px overflow-auto',
              loading && 'animate-pulse',
            )}
          >
            {allowClear && (
              <Option
                key="undefined"
                size={size}
                selected={valueAsArray.length === 0}
                onClick={() => handleOptionClick(undefined)}
                checkbox={multiple}
              >
                {renderFn(undefined)}
              </Option>
            )}
            {!searchValue &&
              valueAsArray
                .filter(opt => !options.includes(opt))
                .map(opt => (
                  <Option
                    key={JSON.stringify(opt)}
                    size={size}
                    selected={valueAsArray.includes(opt)}
                    onClick={() => handleOptionClick(opt)}
                    checkbox={multiple}
                  >
                    {renderFn(opt)}
                  </Option>
                ))}
            {options
              .sort(opt => (valueAsArray.includes(opt) ? -1 : 1))
              .map(opt => (
                <Option
                  key={JSON.stringify(opt)}
                  size={size}
                  onClick={() => handleOptionClick(opt)}
                  selected={valueAsArray.includes(opt)}
                  checkbox={multiple}
                >
                  {renderFn(opt)}
                </Option>
              ))}
          </div>
        </div>
      }
      rootClassName="w-auto [&_.ant-tooltip-inner]:rounded-xl [&_.ant-tooltip-inner]:!bg-v1-surface-l4 [&_.ant-tooltip-arrow]:hidden [&_.ant-tooltip-inner]:!p-4 [&_.ant-tooltip-inner]:!text-inherit"
      open={isOpen}
      destroyTooltipOnHide
    >
      <div
        className={clsx(
          /* Size: height, padding, font-size, border-radius */
          size === 'xs' && 'h-xs rounded-md px-3 text-xs',
          size === 'sm' && 'h-sm rounded-lg px-3 text-xs',
          size === 'md' && 'h-md rounded-lg px-3 text-xs',
          size === 'xl' && 'h-xl rounded-xl px-4 text-sm',
          /* Loading */
          loading && 'animate-pulse',
          /* Style */
          'bg-v1-surface-l-next',
          /* Disabled */
          'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-white/5 disabled:bg-none disabled:text-white/50 disabled:grayscale',
          /* Shared */
          'select-none border border-transparent font-normal transition-all focus:border-v1-border-focus [&_svg]:size-5',
          block ? 'flex' : 'inline-flex',
          'items-center justify-between gap-1',
          className,
        )}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        ref={contentRef}
        // onClick={() => setIsOpen(p => !p)}
        onFocus={() => setIsOpen(() => true)}
      >
        {prefixIcon}
        <div className="grow">
          <InnerContent
            allowClear={allowClear}
            multiple={multiple}
            render={renderFn}
            placeholder={placeholder}
            value={value}
          />
        </div>
        {suffixIcon}
        <Icon
          name={bxChevronDown}
          className={clsx(
            'justify-self-end text-inherit opacity-70 transition-all group-hover:opacity-100',
            isOpen && '!opacity-100',
          )}
          size={16}
        />
      </div>
    </AntTooltip>
  );
}
