import { v4 } from 'uuid';
import { clsx } from 'clsx';
import { bxPlus } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useSignalerAssetPrice, type SignalerData } from 'api/builder';
import AmountInputBox from 'shared/AmountInputBox';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
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
            onDelete={() => setItems(items.filter(x => x.key !== tp.key))}
          >
            <div className="flex items-center gap-2 p-2">
              <AmountInputBox
                label="Order Price"
                suffix="USDT"
                className="w-2/3"
                value={String(tp.priceExact)}
                onChange={val =>
                  setItems(
                    items.map(x =>
                      x.key === tp.key ? { ...x, priceExact: +val } : x,
                    ),
                  )
                }
              />
              <AmountInputBox
                label="Volume"
                className="w-1/3"
                suffix="%"
                value={String(tp.amountRatio)}
                onChange={val =>
                  setItems(
                    items.map(x =>
                      x.key === tp.key ? { ...x, amountRatio: +val } : x,
                    ),
                  )
                }
              />
            </div>
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
                amountRatio: 100,
                priceExact: assetPrice ?? 0,
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
