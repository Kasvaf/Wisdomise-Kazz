import { v4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { bxsCheckCircle, bxTrash } from 'boxicons-quasar';
import { useParams } from 'react-router-dom';
import { roundDown } from 'utils/numbers';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { useLastPriceQuery } from 'api';
import InfoButton from 'shared/InfoButton';
import PriceVolumeInput from './PriceVolumeInput';
import { type SignalFormState } from './useSignalFormStates';

const PartSafetyOpen: React.FC<{
  data: SignalFormState;
  assetSlug: string;
}> = ({ data }) => {
  const { t } = useTranslation('builder');
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');

  const {
    price: [price],
    orderType: [orderType],
    market: [market],
    safetyOpens: [items, setItems],
    remainingVolume,
  } = data;

  const { data: assetPrice } = useLastPriceQuery({ slug, exchange: 'STONFI' });
  const effectivePrice = Number(orderType === 'market' ? assetPrice : price);

  const nextLine = () => {
    const dir = market === 'long' ? -0.005 : 0.005;
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
          {t('signal-form.safety-open.title')}{' '}
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
                },
              ])
            }
            disabled={remainingVolume <= 0}
          >
            {t('signal-form.safety-open.btn-new')}
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
                    {t('strategy:position-detail-modal.hitted')}
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

        {!!remainingVolume && (
          <div className="text-center text-xs text-error">
            {t('signal-form.error-total-open')}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartSafetyOpen;
