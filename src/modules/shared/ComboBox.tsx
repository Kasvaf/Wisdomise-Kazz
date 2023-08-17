import type React from 'react';
import { useState } from 'react';
import { ReactComponent as ChevronDown } from '@images/chevron-down.svg';
import { Dropdown } from 'antd';
import { clsx } from 'clsx';

interface Props {
  options: any[];
  selectedItem: any;
  renderItem: (item: any) => React.ReactElement;
  onSelect: (item: any) => void;
  disabled?: boolean;
}

const ComboBox: React.FC<Props> = ({
  options,
  renderItem,
  selectedItem,
  onSelect,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const dropDownFn = () => (
    <div className="overflow-hidden rounded-[24px] bg-[#272A32] text-white">
      {options.map((item, ind) => (
        <div
          className={clsx(
            'cursor-pointer py-4 pl-6 pr-2 hover:bg-black/20',
            ind !== options.length - 1 && 'border-b border-white/5',
          )}
          onClick={() => {
            onSelect(item);
            setOpen(false);
          }}
          key={JSON.stringify(item)}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );

  const disabledOrEmpty = disabled || options.length <= 1;
  return (
    <Dropdown
      open={open}
      trigger={['click']}
      onOpenChange={setOpen}
      placement="bottomRight"
      dropdownRender={dropDownFn}
      disabled={disabledOrEmpty}
    >
      <div
        className={clsx(
          'flex h-12 rounded-full',
          'items-center justify-between',
          'bg-black/40 pl-6 pr-2',
          !disabledOrEmpty && 'cursor-pointer hover:bg-white/5',
          open && 'bg-white/5',
        )}
      >
        {renderItem(selectedItem)}

        {options.length > 1 && (
          <div className="flex items-center rounded-full bg-white/10 p-1">
            <ChevronDown
              className={clsx('fill-white', open && '-scale-y-100')}
            />
          </div>
        )}
      </div>
    </Dropdown>
  );
};

export default ComboBox;
