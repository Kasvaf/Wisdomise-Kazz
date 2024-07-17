import { v4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { bxsCheckCircle, bxTrash } from 'boxicons-quasar';
import { useSignalerAssetPrice, type SignalerData } from 'api/builder';
import { roundDown } from 'utils/numbers';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import PriceVolumeInput from './PriceVolumeInput';
import { type SignalFormState } from './useSignalFormStates';

const PartSafetyOpen: React.FC<{
  data: SignalFormState;
  signaler: SignalerData;
  assetName: string;
}> = ({ signaler, assetName, data }) => {
  const { t } = useTranslation('builder');
  const {
    price: [price],
    volume: [volume],
    orderType: [orderType],
    market: [market],
    safetyOpens: [items, setItems],
  } = data;

  const { data: assetPrice } = useSignalerAssetPrice({
    strategyKey: signaler.key,
    assetName,
  });

  const effectivePrice = Number(orderType === 'market' ? assetPrice : price);

  const remainingVolume =
    100 -
    +volume -
    items
      .filter(x => !x.removed)
      .reduce((a, b) => a + Number(b.amountRatio), 0);

  const nextLine = () => {
    const dir = market === 'long' ? 0.01 : -0.01;
    for (let i = 1; i <= items.length; ++i) {
      const price = String(roundDown(effectivePrice * (1 + dir * i), 2));
      if (!items.some(x => !x.removed && x.priceExact === price)) {
        return price;
      }
    }
    return String(effectivePrice);
  };

  return (
    <div>
      <div className="mb-2 flex justify-between">
        <h1>Safety Open</h1>
        {!Number.isNaN(effectivePrice) && !Number.isNaN(remainingVolume) && (
          <Button
            variant="alternative"
            className="!p-2 text-xxs"
            onClick={() =>
              setItems([
                ...items,
                {
                  key: v4(),
                  amountRatio: String(remainingVolume),
                  priceExact: nextLine(),
                  applied: false,
                  removed: false,
                },
              ])
            }
          >
            + New Safety Open
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {items
          .filter(x => !x.removed)
          .map((item, ind) => (
            <div key={item.key}>
              <div className="flex items-center">
                <div className="mr-1">{ind + 1}.</div>
                <PriceVolumeInput
                  price={String(item.priceExact)}
                  onPriceChange={val =>
                    setItems(
                      items.map(x =>
                        x.key === item.key ? { ...x, priceExact: val } : x,
                      ),
                    )
                  }
                  volume={String(item.amountRatio)}
                  onVolumeChange={val =>
                    setItems(
                      items.map(x =>
                        x.key === item.key ? { ...x, amountRatio: val } : x,
                      ),
                    )
                  }
                  className="grow"
                  appliedAt={item.appliedAt}
                />

                {item.applied ? (
                  <div className="ml-2 flex w-[68px] items-center rounded-full bg-white pr-2 text-xs text-black">
                    <Icon name={bxsCheckCircle} />
                    Hitted
                  </div>
                ) : (
                  <div className="ml-2 flex">
                    <Button
                      variant="link"
                      className="!p-2"
                      onClick={() =>
                        setItems(
                          items.map(x =>
                            x.key === item.key ? { ...x, removed: true } : x,
                          ),
                        )
                      }
                    >
                      <Icon name={bxTrash} />
                    </Button>
                  </div>
                )}
              </div>

              {items.some(
                (x, ind0) =>
                  !x.removed && ind0 < ind && x.priceExact === item.priceExact,
              ) && (
                <div className="px-2 pb-2 text-error">
                  {t('signal-form.error-dup', { type: 'Safety Open' })}
                </div>
              )}
            </div>
          ))}

        {remainingVolume < 0 && (
          <div className="text-center text-xs text-error">
            Total sum of open volumes cannot be more than 100%
          </div>
        )}
      </div>
    </div>
  );
};

export default PartSafetyOpen;
