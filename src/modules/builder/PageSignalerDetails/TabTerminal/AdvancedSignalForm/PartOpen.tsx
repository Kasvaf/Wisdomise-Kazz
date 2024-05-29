import { useTranslation } from 'react-i18next';
import { useSignalerAssetPrice, type SignalerData } from 'api/builder';
import { roundDown } from 'utils/numbers';
import AmountInputBox from 'shared/AmountInputBox';
import OrderTypeToggle from '../OrderTypeToggle';
import MarketToggle from '../MarketToggle';
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
  } = data;

  const { data: assetPrice } = useSignalerAssetPrice({
    strategyKey: signaler.key,
    assetName,
  });

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
              : price
          }
          onChange={setPrice}
          suffix="USDT"
          className="grow"
          disabled={orderType === 'market'}
        />
        <OrderTypeToggle value={orderType} onChange={setOrderType} />
      </div>
    </ClosablePart>
  );
};

export default PartOpen;
