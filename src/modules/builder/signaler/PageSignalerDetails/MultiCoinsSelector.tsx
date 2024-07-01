import { clsx } from 'clsx';
import { Dropdown } from 'antd';
import { bxPlus, bxX } from 'boxicons-quasar';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type PairData } from 'api/types/strategy';
import DropdownContainer from 'shared/DropdownContainer';
import PairInfo from 'shared/PairInfo';
import Button from 'shared/Button';
import Icon from 'shared/Icon';

interface Props {
  options: PairData[];
  items: PairData[];
  onChange: (newItems: PairData[]) => void;
  className?: string;
}

const MultiCoinsSelector: React.FC<Props> = ({
  options,
  items,
  onChange,
  className,
}) => {
  const { t } = useTranslation('builder');
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
        <div className="mb-3 text-center text-white">
          {t('multi-coin-selector.add-coin')}
        </div>
        <div className="flex h-[300px] flex-col gap-2 overflow-y-scroll">
          {unusedAssets.map(a => (
            <div
              key={a.name}
              className="flex cursor-pointer items-center rounded-lg bg-black/30 !p-2 hover:bg-black/70"
              onClick={() =>
                onChange(
                  [...items, a].sort((a, b) => a.name.localeCompare(b.name)),
                )
              }
            >
              <PairInfo
                title={a.display_name}
                base={a.base.name}
                quote={a.quote.name}
                name={a.name}
                className="!p-1"
              />
            </div>
          ))}
        </div>
      </DropdownContainer>
    ),
    [t, unusedAssets, onChange, items],
  );

  return (
    <div className={clsx('flex flex-wrap gap-3', className)}>
      {items.map(p => (
        <div
          key={p.name}
          className="flex items-center justify-between rounded-xl bg-black/20 p-2 mobile:w-full"
        >
          <PairInfo
            title={p.display_name}
            base={p.base.name}
            quote={p.quote.name}
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
          autoAdjustOverflow
        >
          <Button
            variant="alternative"
            className="h-[60px] w-[60px] mobile:mx-auto"
          >
            <Icon name={bxPlus} />
          </Button>
        </Dropdown>
      )}
    </div>
  );
};

export default MultiCoinsSelector;
