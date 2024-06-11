import { v4 } from 'uuid';
import { clsx } from 'clsx';
import { useEffect } from 'react';
import { bxPlus } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useSignalerAssetPrice, type SignalerData } from 'api/builder';
import { roundDown } from 'utils/numbers';
import Icon from 'shared/Icon';
import Button from 'shared/Button';
import AmountInputBox from 'shared/AmountInputBox';
import ClosablePart from './ClosablePart';
import Collapsible from './Collapsible';
import { sortTpSlItems, type SignalFormState } from './useSignalFormStates';

const PartTpSl: React.FC<{
  type: 'TP' | 'SL';
  data: SignalFormState;
  signaler: SignalerData;
  assetName: string;
}> = ({ type, signaler, assetName, data }) => {
  const { t } = useTranslation('builder');
  const {
    price: [price],
    market: [market],
    orderType: [orderType],
    [type === 'TP' ? 'takeProfits' : 'stopLosses']: [items, setItems],
  } = data;

  const { data: assetPrice } = useSignalerAssetPrice({
    strategyKey: signaler.key,
    assetName,
  });

  const effectivePrice =
    orderType === 'market'
      ? assetPrice === undefined
        ? 0
        : assetPrice
      : +price;

  const colorClassName = clsx(
    type === 'TP' ? 'bg-[#11C37E0D]' : 'bg-[#F140560D]',
  );

  const sortItems = () =>
    setItems(items => sortTpSlItems({ items, type, market }));

  useEffect(sortItems, [setItems, type, market]);
  const first100Index = items.findIndex(
    x => !x.removed && +x.amountRatio >= 100,
  );

  return (
    <ClosablePart
      title={
        type === 'TP'
          ? t('signal-form.take-profit')
          : t('signal-form.stop-loss')
      }
    >
      <div className="flex flex-col gap-2">
        {items
          .filter(x => !x.removed)
          .map((item, ind) => (
            <Collapsible
              className={colorClassName}
              headerClassName={colorClassName}
              key={item.key}
              title={`${type} #${String(ind + 1)}`}
              applied={item.applied}
              onDelete={() =>
                setItems(
                  items.map(x =>
                    x.key === item.key ? { ...x, removed: true } : x,
                  ),
                )
              }
            >
              <div className="flex items-center gap-2 p-2">
                <AmountInputBox
                  label="Order Price"
                  suffix="USDT"
                  className="w-2/3"
                  disabled={item.applied}
                  value={String(item.priceExact)}
                  onChange={val =>
                    setItems(
                      items.map(x =>
                        x.key === item.key ? { ...x, priceExact: val } : x,
                      ),
                    )
                  }
                  onBlur={sortItems}
                />
                <AmountInputBox
                  label="Volume"
                  suffix="%"
                  className="w-1/3"
                  disabled={item.applied}
                  value={String(item.amountRatio)}
                  min={0}
                  max={100}
                  onChange={val =>
                    setItems(
                      items.map(x =>
                        x.key === item.key ? { ...x, amountRatio: val } : x,
                      ),
                    )
                  }
                />
              </div>

              {first100Index >= 0 && first100Index < ind && (
                <div className="px-2 pb-2 text-error">
                  {t('signal-form.error-100', {
                    type,
                  })}
                </div>
              )}

              {items.some(
                (x, ind0) =>
                  !x.removed && ind0 < ind && x.priceExact === item.priceExact,
              ) && (
                <div className="px-2 pb-2 text-error">
                  {t('signal-form.error-dup', {
                    type,
                  })}
                </div>
              )}
            </Collapsible>
          ))}

        <div className="text-center text-xs text-white/50">
          {t('signal-form.conditions-use-market-price')}
        </div>
        <Button
          variant="alternative"
          className="!py-2"
          onClick={() =>
            setItems([
              ...items,
              {
                key: v4(),
                amountRatio: '100',
                priceExact: String(
                  roundDown(
                    effectivePrice *
                      (market === 'long'
                        ? type === 'TP'
                          ? 1.1
                          : 0.9
                        : type === 'TP'
                        ? 0.9
                        : 1.1),
                    2,
                  ),
                ),
                applied: false,
                removed: false,
              },
            ])
          }
        >
          <Icon name={bxPlus} />{' '}
          {type === 'TP'
            ? t('signal-form.btn-new-take-profit')
            : t('signal-form.btn-new-stop-loss')}
        </Button>
      </div>
    </ClosablePart>
  );
};

export default PartTpSl;
