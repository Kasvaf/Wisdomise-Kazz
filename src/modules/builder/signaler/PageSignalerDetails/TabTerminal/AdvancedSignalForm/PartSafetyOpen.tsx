import { v4 } from 'uuid';
import { clsx } from 'clsx';
import { bxPlus } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useSignalerAssetPrice, type SignalerData } from 'api/builder';
import { roundDown } from 'utils/numbers';
import Icon from 'shared/Icon';
import Button from 'shared/Button';
import AmountInputBox from 'shared/AmountInputBox';
import ClosablePart from './ClosablePart';
import Collapsible from './Collapsible';
import { type SignalFormState } from './useSignalFormStates';

const PartSafetyOpen: React.FC<{
  data: SignalFormState;
  signaler: SignalerData;
  assetName: string;
}> = ({ signaler, assetName, data }) => {
  const { t } = useTranslation('builder');
  const {
    price: [price],
    orderType: [orderType],
    safetyOpens: [items, setItems],
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

  const colorClassName = clsx('bg-[#34A3DA0D]');

  return (
    <ClosablePart title="Safety Open">
      <div className="flex flex-col gap-2">
        {items
          .filter(x => !x.removed)
          .map((item, ind) => (
            <Collapsible
              className={colorClassName}
              headerClassName={colorClassName}
              key={item.key}
              title={`Safety Open #${String(ind + 1)}`}
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
                  label={t('signal-form.price')}
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
                />
                <AmountInputBox
                  label={t('signal-form.volume')}
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

              {items.some(
                (x, ind0) =>
                  !x.removed && ind0 < ind && x.priceExact === item.priceExact,
              ) && (
                <div className="px-2 pb-2 text-error">
                  {t('signal-form.error-dup', { type: 'Safety Open' })}
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
                priceExact: String(roundDown(effectivePrice, 2)),
                applied: false,
                removed: false,
              },
            ])
          }
        >
          <Icon name={bxPlus} /> New Safety Open
        </Button>
      </div>
    </ClosablePart>
  );
};

export default PartSafetyOpen;
