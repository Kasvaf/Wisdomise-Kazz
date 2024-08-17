import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSignalerAssetPrice, type SignalerData } from 'api/builder';
import { roundDown, roundSensible } from 'utils/numbers';
import InfoButton from 'shared/InfoButton';
import OrderTypeToggle from '../OrderTypeToggle';
import MarketToggle from '../MarketToggle';
import DurationInput from '../DurationInput';
import OpenConditions from './OpenConditions';
import { type SignalFormState } from './useSignalFormStates';
import PriceVolumeInput from './PriceVolumeInput';

const PartOpen: React.FC<{
  data: SignalFormState;
  signaler: SignalerData;
  assetName: string;
}> = ({ signaler, assetName, data }) => {
  const { t } = useTranslation('builder');
  const {
    isUpdate: [isUpdate],
    market: [market, setMarket],
    orderType: [orderType, setOrderType],
    price: [price, setPrice],
    priceUpdated: [priceUpdated, setPriceUpdated],
    volume: [volume, setVolume],
    exp: [exp, setExp],
    orderExp: [orderExp, setOrderExp],

    takeProfits: [takeProfits, setTakeProfits],
    stopLosses: [stopLosses, setStopLosses],
    safetyOpens: [, setSafetyOpens],
  } = data;

  const { data: assetPrice } = useSignalerAssetPrice({
    strategyKey: signaler.key,
    assetName,
  });

  useEffect(() => {
    if (!priceUpdated && assetPrice && !isUpdate) {
      setPrice(String(assetPrice));
    }
  }, [assetPrice, isUpdate, priceUpdated, setPrice]);

  const effectivePrice = Number(orderType === 'market' ? assetPrice : price);
  const onMarketChangeHandler = (x: 'long' | 'short') => {
    if (x === market) return;
    const oldTakeProfits = takeProfits;
    setTakeProfits(stopLosses);
    setStopLosses(oldTakeProfits);
    setSafetyOpens(items =>
      items.map(x => ({
        ...x,
        priceExact: String(
          roundDown(effectivePrice - (+x.priceExact - effectivePrice), 2),
        ),
      })),
    );
    setMarket(x);
  };

  return (
    <div>
      {signaler?.market_name === 'FUTURES' && (
        <div className="mb-5 flex gap-2 border-b border-white/10 pb-5">
          <MarketToggle
            className="grow"
            value={market}
            onChange={onMarketChangeHandler}
            disabled={isUpdate}
          />
          {/* <AmountInputBox className="w-14" value="2x" /> */}
        </div>
      )}

      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <div>Open: </div>
          <OrderTypeToggle
            value={orderType}
            onChange={setOrderType}
            disabled={isUpdate}
          />
        </div>
        {orderType === 'market' && (
          <OpenConditions
            assetName={assetName}
            data={data}
            signaler={signaler}
          />
        )}
      </div>

      <PriceVolumeInput
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
    </div>
  );
};

export default PartOpen;
