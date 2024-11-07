import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useCoinOverview } from 'api';
import { roundSensible } from 'utils/numbers';
import { ButtonSelect } from 'shared/ButtonSelect';
import InfoButton from 'shared/InfoButton';
import TextBox from 'shared/TextBox';
import DurationInput from '../DurationInput';
import PriceVolumeInput from './PriceVolumeInput';
import AIPresets from './AIPressets';
import { type SignalFormState } from './useSignalFormStates';

const PartOpen: React.FC<{
  data: SignalFormState;
  assetName: string;
  assetSlug: string;
}> = ({ data, assetName, assetSlug }) => {
  const { t } = useTranslation('builder');
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');

  const {
    isUpdate: [isUpdate],
    orderType: [orderType, setOrderType],
    amount: [amount, setAmount],
    price: [price, setPrice],
    priceUpdated: [priceUpdated, setPriceUpdated],
    volume: [volume, setVolume],
    exp: [exp, setExp],
    orderExp: [orderExp, setOrderExp],
  } = data;

  const { data: lastPrice } = useCoinOverview({ slug });
  const assetPrice = lastPrice?.data?.current_price;

  useEffect(() => {
    if (!priceUpdated && assetPrice && !isUpdate) {
      setPrice(String(assetPrice));
    }
  }, [assetPrice, isUpdate, priceUpdated, setPrice]);

  return (
    <div>
      {false && (
        <ButtonSelect
          className="mb-3 w-full"
          value={orderType}
          options={[
            {
              label: t('common:order-type.limit'),
              value: 'limit',
              disabled: isUpdate,
            },
            {
              label: t('common:order-type.market'),
              value: 'market',
              disabled: isUpdate,
            },
          ]}
          onChange={setOrderType}
        />
      )}

      <TextBox
        label="Amount"
        type="number"
        value={amount}
        onChange={value => setAmount(value)}
        suffix="USDT"
        className="mb-3"
        disabled={isUpdate}
      />

      <AIPresets data={data} assetName={assetName} assetSlug={assetSlug} />

      <div className="my-4 border-b border-white/5" />

      <PriceVolumeInput
        label={t('signal-form.open.title')}
        price={
          orderType === 'market' && !isUpdate
            ? assetPrice === undefined
              ? '-'
              : '~ ' + roundSensible(assetPrice)
            : price ?? assetPrice ?? '-'
        }
        onPriceChange={p => {
          setPrice(p);
          setPriceUpdated(true);
        }}
        disabledPrice={isUpdate || orderType === 'market'}
        volume={volume}
        onVolumeChange={setVolume}
        disabledVolume={isUpdate}
        className="mb-5 grow"
      />

      {false && (
        <div className="flex items-end gap-2">
          <DurationInput
            className="grow"
            label={
              <div className="flex items-center">
                {t('signal-form.expiration-time.title')}
                <InfoButton
                  className="ml-1 !opacity-50"
                  title={t('signal-form.expiration-time.info-title')}
                  text={t('signal-form.expiration-time.info-text')}
                />
              </div>
            }
            value={exp}
            onChange={setExp}
            disabled={isUpdate}
          />
          {orderType === 'limit' && (
            <DurationInput
              className="grow"
              label={
                <div className="flex items-center">
                  {t('signal-form.order-expiration-time.title')}
                  <InfoButton
                    className="ml-1 !opacity-50"
                    title={t('signal-form.order-expiration-time.info-title')}
                    text={t('signal-form.order-expiration-time.info-text')}
                  />
                </div>
              }
              value={orderExp}
              onChange={setOrderExp}
              disabled={isUpdate}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PartOpen;
