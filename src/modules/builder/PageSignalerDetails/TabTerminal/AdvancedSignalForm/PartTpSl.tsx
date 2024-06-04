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
    [type === 'TP' ? 'hasTakeProfit' : 'hasStopLosses']: [
      isEnabled,
      setIsEnabled,
    ],
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

  return (
    <ClosablePart
      title={
        type === 'TP'
          ? t('signal-form.take-profit')
          : t('signal-form.stop-loss')
      }
      isOpen={isEnabled}
      onIsOpenChanged={setIsEnabled}
    >
      <div className="flex flex-col gap-2">
        {items.map((tp, ind) => (
          <Collapsible
            className={colorClassName}
            headerClassName={colorClassName}
            key={tp.key}
            title={`${type} #${String(ind + 1)}`}
            applied={tp.applied}
            onDelete={() => setItems(items.filter(x => x.key !== tp.key))}
          >
            <div className="flex items-center gap-2 p-2">
              <AmountInputBox
                label="Order Price"
                suffix="USDT"
                className="w-2/3"
                disabled={tp.applied}
                value={String(tp.priceExact)}
                onChange={val =>
                  setItems(
                    items.map(x =>
                      x.key === tp.key ? { ...x, priceExact: val } : x,
                    ),
                  )
                }
                onBlur={() =>
                  setItems(items =>
                    [...items].sort((a, b) => +a.priceExact - +b.priceExact),
                  )
                }
              />
              <AmountInputBox
                label="Volume"
                suffix="%"
                className="w-1/3"
                disabled={tp.applied}
                value={String(tp.amountRatio)}
                min={0}
                max={100}
                onChange={val =>
                  setItems(
                    items.map(x =>
                      x.key === tp.key ? { ...x, amountRatio: val } : x,
                    ),
                  )
                }
              />
            </div>

            {items.findIndex(x => +x.amountRatio >= 100) < ind && (
              <div className="px-2 pb-2 text-error">
                {t('signal-form.error-100', {
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
