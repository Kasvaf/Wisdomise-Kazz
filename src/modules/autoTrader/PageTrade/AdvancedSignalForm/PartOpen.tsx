import { bxsCheckCircle, bxTrash } from 'boxicons-quasar';
import { useTranslation } from 'react-i18next';
import { useLastPriceStream } from 'services/price';
import Button from 'shared/Button';
import ComboBox from 'shared/ComboBox';
import Icon from 'shared/Icon';
import InfoButton from 'shared/InfoButton';
import { roundDown, roundSensible } from 'utils/numbers';
import { v4 } from 'uuid';
import PriceVolumeInput from './PriceVolumeInput';
import type { SignalFormState } from './useSignalFormStates';

const PartOpen: React.FC<{
  data: SignalFormState;
  baseSlug: string;
}> = ({ data, baseSlug }) => {
  const { t } = useTranslation('builder');

  const {
    isUpdate: [isUpdate],
    quote: [quote],
    safetyOpens: [items, setItems],
    isOrderLimitReached,
    remainingVolume,
  } = data;

  const { data: assetPrice } = useLastPriceStream({
    slug: baseSlug,
    quote,
    convertToUsd: true,
  });
  const effectivePrice = Number(
    (!items[0] || items[0].isMarket) && !isUpdate
      ? assetPrice
      : items[0]?.priceExact,
  );

  const nextLine = () => {
    const dir = -0.005;
    for (let i = 1; i <= items.length + 1; ++i) {
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
        <h1 className="flex items-center gap-1 text-sm">
          {t('signal-form.open-orders.title')}{' '}
          <InfoButton text={t('info.safety-open')} />
        </h1>
        {!Number.isNaN(effectivePrice) && !Number.isNaN(remainingVolume) && (
          <Button
            className="!p-2 text-xxs"
            disabled={isOrderLimitReached}
            onClick={() =>
              setItems([
                ...items,
                {
                  key: v4(),
                  amountRatio: String(remainingVolume),
                  priceExact: nextLine(),
                  applied: false,
                  removed: false,
                  isMarket: false,
                },
              ])
            }
            variant="alternative"
          >
            {t('signal-form.open-orders.btn-new')}
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {items
          .filter(
            x => !x.removed && (!Number.isNaN(+x.amountRatio) || !x.isMarket),
          )
          .map((item, ind) => (
            <div key={item.key}>
              <div className="flex items-center">
                <div className="mr-1">{ind + 1}.</div>
                <PriceVolumeInput
                  appliedAt={item.appliedAt}
                  basePrice={assetPrice}
                  className="grow"
                  dirPrice="-"
                  disabledPrice={item.isMarket}
                  disabledVolume={!ind && isUpdate}
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
                  price={
                    item.isMarket && !item.applied
                      ? assetPrice === undefined
                        ? '-'
                        : `~ ${roundSensible(assetPrice)}`
                      : String(item.priceExact)
                  }
                  volume={String(item.amountRatio)}
                />

                {item.applied ? (
                  <div className="ml-2 flex w-[68px] items-center rounded-full bg-white pr-2 text-black text-xs">
                    <Icon name={bxsCheckCircle} />
                    {t('strategy:position-detail-modal.hitted')}
                  </div>
                ) : (
                  <div className="ml-2 flex">
                    {ind === 0 ? (
                      !isUpdate && (
                        <ComboBox
                          className="!h-10 text-xs"
                          onSelect={y =>
                            setItems(items =>
                              items.map((x, i) =>
                                i
                                  ? x
                                  : {
                                      ...x,
                                      isMarket: y === 'Market',
                                      priceExact:
                                        (y === 'Stop Market' &&
                                          roundSensible(assetPrice)) ||
                                        x.priceExact,
                                    },
                              ),
                            )
                          }
                          optionClassName="text-xs"
                          options={['Market', 'Stop Market']}
                          renderItem={(x, full) =>
                            full || x === 'Market' ? x : 'Stop'
                          }
                          selectedItem={
                            item.isMarket ? 'Market' : 'Stop Market'
                          }
                        />
                      )
                    ) : (
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
                    )}
                  </div>
                )}
              </div>

              {items.some(
                (x, ind0) =>
                  !x.removed && ind0 < ind && x.priceExact === item.priceExact,
              ) && (
                <div className="px-2 pb-2 text-v1-content-negative">
                  {t('signal-form.error-dup', { type: 'Open Order' })}
                </div>
              )}
            </div>
          ))}

        {!!remainingVolume && (
          <div className="text-center text-v1-content-negative text-xs">
            {t('signal-form.error-total-open')}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartOpen;
