import { v4 } from 'uuid';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { bxsCheckCircle, bxTrash } from 'boxicons-quasar';
import { roundSensible } from 'utils/numbers';
import { useLastPriceQuery } from 'api';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import InfoButton from 'shared/InfoButton';
import { sortTpSlItems, type SignalFormState } from './useSignalFormStates';
import PriceVolumeInput from './PriceVolumeInput';

const PartTpSl: React.FC<{
  type: 'TP' | 'SL';
  data: SignalFormState;
  assetSlug: string;
}> = ({ type, data, assetSlug }) => {
  const { t } = useTranslation('builder');
  const {
    price: [price],
    market: [market],
    orderType: [orderType],
    [type === 'TP' ? 'takeProfits' : 'stopLosses']: [items, setItems],
    isOrderLimitReached,
  } = data;
  const { data: assetPrice } = useLastPriceQuery({
    slug: assetSlug,
    exchange: 'STONFI',
  });
  const effectivePrice = Number(orderType === 'market' ? assetPrice : price);

  const sortItems = () =>
    setItems(items => sortTpSlItems({ items, type, market }));

  useEffect(sortItems, [setItems, type, market]);

  const dir = (type === 'TP' ? 1 : -1) * (market === 'long' ? 1 : -1);
  const nextLine = () => {
    const dir =
      market === 'long'
        ? type === 'TP'
          ? 0.01
          : -0.01
        : type === 'TP'
        ? -0.01
        : 0.01;

    for (let i = 1; i <= items.length + 1; ++i) {
      const price = roundSensible(effectivePrice * (1 + dir * i));
      if (!items.some(x => !x.removed && x.priceExact === price)) {
        return price;
      }
    }
    return String(effectivePrice);
  };

  const visibleItems = items.filter(x => !x.removed);
  const volSum = visibleItems.reduce((a, b) => a + +b.amountRatio, 0);

  return (
    <div>
      <div className="mb-2 flex justify-between">
        <h1 className="flex items-center gap-1">
          {type === 'TP'
            ? t('signal-form.take-profit')
            : t('signal-form.stop-loss')}
          <InfoButton
            text={type === 'TP' ? t('info.take-profit') : t('info.stop-loss')}
          />
        </h1>

        {!Number.isNaN(effectivePrice) && (
          <Button
            variant="alternative"
            className="!p-2 text-xxs"
            onClick={() =>
              setItems([
                ...items,
                {
                  key: v4(),
                  amountRatio: String(100 - volSum),
                  priceExact: nextLine(),
                  applied: false,
                  removed: false,
                },
              ])
            }
            disabled={isOrderLimitReached}
          >
            {'+ '}
            {type === 'TP'
              ? t('signal-form.btn-new-take-profit')
              : t('signal-form.btn-new-stop-loss')}
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {visibleItems.map((item, ind) => (
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
                onPriceBlur={sortItems}
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

            {!item.applied && (
              <>
                {dir === 1 && +item.priceExact <= effectivePrice && (
                  <div className="px-2 pb-2 text-error">
                    {t('signal-form.error-max', {
                      type,
                      market:
                        market === 'long'
                          ? t('common:market.long')
                          : t('common:market.short'),
                    })}
                  </div>
                )}

                {dir === -1 && +item.priceExact >= effectivePrice && (
                  <div className="px-2 pb-2 text-error">
                    {t('signal-form.error-min', {
                      type,
                      market:
                        market === 'long'
                          ? t('common:market.long')
                          : t('common:market.short'),
                    })}
                  </div>
                )}
              </>
            )}

            {items.some(
              (x, ind0) =>
                !x.removed && ind0 < ind && x.priceExact === item.priceExact,
            ) && (
              <div className="px-2 pb-2 text-error">
                {t('signal-form.error-dup', { type })}
              </div>
            )}
          </div>
        ))}

        {volSum > 100.1 && (
          <div className="px-2 pb-2 text-error">
            {t('signal-form.error-bg-100', { type })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartTpSl;
