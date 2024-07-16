import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSignalerAssetPrice, type SignalerData } from 'api/builder';
import { roundDown } from 'utils/numbers';
import InfoButton from 'shared/InfoButton';
import AmountInputBox from 'shared/AmountInputBox';
import OrderTypeToggle from '../OrderTypeToggle';
import MarketToggle from '../MarketToggle';
import DurationInput from '../DurationInput';
import ClosablePart from './ClosablePart';
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
    market: [market, setMarket],
    orderType: [orderType, setOrderType],
    price: [price, setPrice],
    priceUpdated: [priceUpdated, setPriceUpdated],
    volume: [volume, setVolume],
    exp: [exp, setExp],
    orderExp: [orderExp, setOrderExp],
  } = data;

  const { data: assetPrice } = useSignalerAssetPrice({
    strategyKey: signaler.key,
    assetName,
  });

  useEffect(() => {
    if (!priceUpdated && assetPrice) {
      setPrice(String(assetPrice));
    }
  }, [assetPrice, priceUpdated, setPrice]);

  return (
    <ClosablePart title="Open">
      {signaler?.market_name === 'FUTURES' && (
        <div className="mb-5 flex gap-2 border-b border-white/10 pb-5">
          <MarketToggle className="grow" value={market} onChange={setMarket} />
          <AmountInputBox className="w-14" value="2x" />
        </div>
      )}

      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <div>Open: </div>
          <OrderTypeToggle value={orderType} onChange={setOrderType} />
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
          orderType === 'market'
            ? assetPrice === undefined
              ? '-'
              : '~ ' + String(roundDown(assetPrice, 2))
            : price ?? '-'
        }
        onPriceChange={p => {
          setPrice(p);
          setPriceUpdated(true);
        }}
        volume={volume}
        onVolumeChange={setVolume}
        disabledPrice={orderType === 'market'}
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
          />
        )}
      </div>
    </ClosablePart>
  );
};

export default PartOpen;
