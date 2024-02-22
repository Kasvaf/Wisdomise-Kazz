import { clsx } from 'clsx';
import { Dropdown } from 'antd';
import { bxPlus, bxX } from 'boxicons-quasar';
import { useCallback, useMemo, useState } from 'react';
import { type Asset } from 'api/builder';
import DropdownContainer from 'shared/DropdownContainer';
import PairInfo from 'shared/PairInfo';
import Button from 'shared/Button';
import Icon from 'shared/Icon';

interface Props {
  options: Asset[];
  items: Asset[];
  onChange: (newItems: Asset[]) => void;
  className?: string;
}

const MultiCoinsSelector: React.FC<Props> = ({
  options,
  items,
  onChange,
  className,
}) => {
  const [coinsOpen, setCoinsOpen] = useState(false);

  const unusedAssets = useMemo(
    () => options?.filter(opt => !items.some(x => x.name === opt.name)) ?? [],
    [items, options],
  );

  const dropDownFn = useCallback(
    () => (
      <DropdownContainer
        className="min-w-[180px] bg-black/20 !p-2"
        setOpen={setCoinsOpen}
      >
        <div className="mb-3 text-center text-white">Add Coin</div>
        <div className="flex flex-col gap-2">
          {unusedAssets.map(a => (
            <div
              key={a.name}
              className="flex cursor-pointer items-center rounded-lg bg-black/30 !p-2 hover:bg-black/70"
              onClick={() => onChange([...items, a])}
            >
              <PairInfo
                title={a.display_name}
                base={a.symbol}
                name={a.name}
                className="!p-1"
              />
            </div>
          ))}
        </div>
      </DropdownContainer>
    ),
    [items, unusedAssets, onChange],
  );

  return (
    <div className={clsx('flex flex-wrap gap-3', className)}>
      {items.map(p => (
        <div
          key={p.name}
          className="flex items-center justify-between rounded-xl bg-black/20 p-2"
        >
          <PairInfo
            title={p.display_name}
            base={p.symbol}
            name={p.name}
            className="!p-1"
          />
          <div
            className="ml-2 cursor-pointer rounded-full p-2 hover:bg-white/5"
            onClick={() => onChange(items.filter(x => x.name !== p.name))}
          >
            <Icon name={bxX} />
          </div>
        </div>
      ))}

      {unusedAssets.length > 0 && (
        <Dropdown
          open={coinsOpen}
          trigger={['click']}
          onOpenChange={setCoinsOpen}
          placement="bottomRight"
          dropdownRender={dropDownFn}
        >
          <Button variant="alternative" className="h-[60px] w-[60px]">
            <Icon name={bxPlus} />
          </Button>
        </Dropdown>
      )}
    </div>
  );
};

export default MultiCoinsSelector;
