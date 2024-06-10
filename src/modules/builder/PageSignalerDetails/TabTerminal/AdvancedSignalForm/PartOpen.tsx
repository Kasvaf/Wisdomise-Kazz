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
import { type SignalFormState } from './useSignalFormStates';

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
        <div>
          <div className="pl-2">{t('signal-form.position-side')}</div>
          <MarketToggle value={market} onChange={setMarket} />
        </div>
      )}

      <div className="flex items-end gap-2">
        <AmountInputBox
          label={t('signal-form.price')}
          value={
            orderType === 'market'
              ? assetPrice === undefined
                ? '-'
                : '~ ' + String(roundDown(assetPrice, 2))
              : price ?? '-'
          }
          onChange={p => {
            setPrice(p);
            setPriceUpdated(true);
          }}
          suffix="USDT"
          className="grow"
          disabled={orderType === 'market'}
        />
        <OrderTypeToggle value={orderType} onChange={setOrderType} />
      </div>

      <div className="flex items-end gap-2">
        <DurationInput
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
        <DurationInput
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
          disabled={orderType === 'market'}
        />
      </div>
    </ClosablePart>
  );
};

export default PartOpen;
