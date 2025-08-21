import { Dropdown } from 'antd';
import { bxChevronDown } from 'boxicons-quasar';
import { clsx } from 'clsx';
import type React from 'react';
import { type PropsWithChildren, useCallback, useState } from 'react';
import Icon from './Icon';

interface Props {
  options: any[];
  selectedItem: any;
  renderItem?: (item: any, full?: boolean) => React.ReactElement;
  onSelect?: (item: any) => void;
  disabled?: boolean;
  className?: string;
  optionClassName?: string;
}

const OptionItem: React.FC<
  PropsWithChildren<{
    className?: string;
    item: any;
    onClick: (item: any) => void;
  }>
> = ({ children, className, item, onClick }) => {
  return (
    <div
      className={clsx(
        'cursor-pointer py-4 pr-2 pl-3 hover:bg-black/20',
        className,
      )}
      key={JSON.stringify(item)}
      onClick={useCallback(() => onClick(item), [onClick, item])}
    >
      {children}
    </div>
  );
};

const ComboBox: React.FC<Props> = ({
  options,
  renderItem,
  selectedItem,
  onSelect,
  disabled = false,
  className,
  optionClassName,
}) => {
  const [open, setOpen] = useState(false);
  const selectItemHandler = useCallback(
    (item: any) => {
      setOpen(false);
      onSelect?.(item);
    },
    [onSelect],
  );

  const dropDownFn = useCallback(
    () => (
      <div
        className="w-full overflow-hidden rounded-xl bg-[#151619] text-white"
        style={{ maxWidth: 'calc(100vw - 80px)' }}
      >
        <div className="max-h-[300px] overflow-auto">
          {options.map((item, ind) => (
            <OptionItem
              className={clsx(
                ind !== options.length - 1 && 'border-white/20 border-b',
                optionClassName,
              )}
              item={item}
              key={JSON.stringify(item)}
              onClick={selectItemHandler}
            >
              {renderItem?.(item, true) || item}
            </OptionItem>
          ))}
        </div>
      </div>
    ),
    [options, renderItem, selectItemHandler, optionClassName],
  );

  const disabledOrEmpty = disabled || options.length <= 1;
  return (
    <Dropdown
      disabled={disabledOrEmpty}
      dropdownRender={dropDownFn}
      onOpenChange={setOpen}
      open={open}
      placement="bottomRight"
      trigger={['click']}
    >
      <div
        className={clsx(
          'flex h-12 rounded-xl',
          'items-center justify-between',
          'bg-black/40 pr-2 pl-3',
          !disabledOrEmpty && 'cursor-pointer hover:bg-white/5',
          open && 'bg-white/5',
          className,
        )}
      >
        <div style={{ width: 'calc(100% - 40px)' }}>
          {renderItem?.(selectedItem, false) || selectedItem}
        </div>

        {options.length > 1 && !disabled && (
          <div className="flex items-center p-1">
            <Icon
              className={clsx(
                'text-white transition-transform',
                open && '-scale-y-100',
              )}
              name={bxChevronDown}
            />
          </div>
        )}
      </div>
    </Dropdown>
  );
};

export default ComboBox;
