import { v4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { bxsCheckCircle, bxTrash } from 'boxicons-quasar';
import { useLastPriceQuery } from 'api';
import { roundDown, roundSensible } from 'utils/numbers';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import ComboBox from 'shared/ComboBox';
import InfoButton from 'shared/InfoButton';
import PriceVolumeInput from './PriceVolumeInput';
import { type SignalFormState } from './useSignalFormStates';

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

  const { data: assetPrice } = useLastPriceQuery({
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
        <h1 className="flex items-center gap-1">
          {t('signal-form.open-orders.title')}{' '}
          <InfoButton text={t('info.safety-open')} />
        </h1>
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
                  isMarket: false,
                },
              ])
            }
            disabled={isOrderLimitReached}
          >
            {t('signal-form.open-orders.btn-new')}
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {items
          .filter(x => !x.removed && (+x.amountRatio || !x.isMarket))
          .map((item, ind) => (
            <div key={item.key}>
              <div className="flex items-center">
                <div className="mr-1">{ind + 1}.</div>
                <PriceVolumeInput
                  price={
                    item.isMarket && !item.applied
                      ? assetPrice === undefined
                        ? '-'
                        : '~ ' + roundSensible(assetPrice)
                      : String(item.priceExact)
                  }
                  disabledVolume={!ind && isUpdate}
                  disabledPrice={item.isMarket}
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
                    {t('strategy:position-detail-modal.hitted')}
                  </div>
                ) : (
                  <div className="ml-2 flex">
                    {ind === 0 ? (
                      !isUpdate && (
                        <ComboBox
                          className="!h-10 text-xs"
                          optionClassName="text-xs"
                          options={['Market', 'Stop Market']}
                          selectedItem={
                            item.isMarket ? 'Market' : 'Stop Market'
                          }
                          renderItem={(x, full) =>
                            full || x === 'Market' ? x : 'Stop'
                          }
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
                        />
                      )
                    ) : (
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
                    )}
                  </div>
                )}
              </div>

              {items.some(
                (x, ind0) =>
                  !x.removed && ind0 < ind && x.priceExact === item.priceExact,
              ) && (
                <div className="px-2 pb-2 text-error">
                  {t('signal-form.error-dup', { type: 'Open Order' })}
                </div>
              )}
            </div>
          ))}

        {!!remainingVolume && (
          <div className="text-center text-xs text-error">
            {t('signal-form.error-total-open')}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartOpen;
