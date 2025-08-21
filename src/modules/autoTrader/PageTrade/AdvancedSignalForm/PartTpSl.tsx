import { useLastPriceQuery } from 'api';
import { bxsCheckCircle, bxTrash } from 'boxicons-quasar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import InfoButton from 'shared/InfoButton';
import { roundSensible } from 'utils/numbers';
import { v4 } from 'uuid';
import PriceVolumeInput from './PriceVolumeInput';
import { type SignalFormState, sortTpSlItems } from './useSignalFormStates';

const PartTpSl: React.FC<{
  type: 'TP' | 'SL';
  data: SignalFormState;
  baseSlug: string;
}> = ({ type, data, baseSlug }) => {
  const { t } = useTranslation('builder');
  const {
    quote: [quote],
    [type === 'TP' ? 'takeProfits' : 'stopLosses']: [items, setItems],
    isOrderLimitReached,
  } = data;
  const { data: assetPrice } = useLastPriceQuery({
    slug: baseSlug,
    quote,
    convertToUsd: true,
  });
  const effectivePrice = Number(assetPrice);

  const sortItems = () => setItems(items => sortTpSlItems({ items, type }));

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(sortItems, [setItems, type]);

  const dir = type === 'TP' ? 1 : -1;
  const nextLine = () => {
    const dir = type === 'TP' ? 0.01 : -0.01;
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
        <h1 className="flex items-center gap-1 text-sm">
          {type === 'TP'
            ? t('signal-form.take-profit')
            : t('signal-form.stop-loss')}
          <InfoButton
            text={type === 'TP' ? t('info.take-profit') : t('info.stop-loss')}
          />
        </h1>

        {!Number.isNaN(effectivePrice) && (
          <Button
            className="!p-2 text-xxs"
            disabled={isOrderLimitReached}
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
            variant="alternative"
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
                appliedAt={item.appliedAt}
                basePrice={assetPrice}
                className="grow"
                dirPrice={type === 'TP' ? '+' : '-'}
                onPriceBlur={sortItems}
                onPriceChange={val =>
                  setItems(
                    items.map(x =>
                      x.key === item.key ? { ...x, priceExact: val } : x,
                    ),
                  )
                }
                onVolumeChange={val =>
                  setItems(
                    items.map(x =>
                      x.key === item.key ? { ...x, amountRatio: val } : x,
                    ),
                  )
                }
                price={String(item.priceExact)}
                volume={String(item.amountRatio)}
              />

              {item.applied ? (
                <div className="ml-2 flex w-[68px] items-center rounded-full bg-white pr-2 text-black text-xs">
                  <Icon name={bxsCheckCircle} />
                  {t('strategy:position-detail-modal.hitted')}
                </div>
              ) : (
                <div className="ml-2 flex">
                  <Button
                    className="!p-2"
                    onClick={() =>
                      setItems(
                        items.map(x =>
                          x.key === item.key ? { ...x, removed: true } : x,
                        ),
                      )
                    }
                    variant="link"
                  >
                    <Icon name={bxTrash} />
                  </Button>
                </div>
              )}
            </div>

            {!item.applied && (
              <>
                {dir === 1 && +item.priceExact <= effectivePrice && (
                  <div className="px-2 pb-2 text-v1-content-negative">
                    {t('signal-form.error-max', {
                      type,
                      market: t('common:market.long'),
                    })}
                  </div>
                )}

                {dir === -1 && +item.priceExact >= effectivePrice && (
                  <div className="px-2 pb-2 text-v1-content-negative">
                    {t('signal-form.error-min', {
                      type,
                      market: t('common:market.long'),
                    })}
                  </div>
                )}
              </>
            )}

            {items.some(
              (x, ind0) =>
                !x.removed && ind0 < ind && x.priceExact === item.priceExact,
            ) && (
              <div className="px-2 pb-2 text-v1-content-negative">
                {t('signal-form.error-dup', { type })}
              </div>
            )}
          </div>
        ))}

        {volSum > 100.1 && (
          <div className="px-2 pb-2 text-v1-content-negative">
            {t('signal-form.error-bg-100', { type })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartTpSl;
