/* eslint-disable import/max-dependencies */
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { notification } from 'antd';
import {
  type Asset,
  useSignalerQuery,
  useCreateSignalMutation,
  useMySignalerOpenPositions,
} from 'api/builder';
import { unwrapErrorMessage } from 'utils/error';
import ActivePosition from 'modules/signaler/ActivePosition';
import SimulatedPositionsChart from 'modules/signaler/SimulatedPositionsChart';
import AmountInputBox from 'shared/AmountInputBox';
import Spinner from 'shared/Spinner';
import Button from 'shared/Button';
import { useRecentCandlesQuery } from 'api';
import AssetSelector from '../AssetSelector';
import MarketToggle from './MarketToggle';
import DurationInput from './DurationInput';
import OrderTypeToggle from './OrderTypeToggle';

function parseDur(dur: string) {
  const val = Number.parseInt(dur);
  const d = new Date();
  switch (dur.replace(/\d+/, '')) {
    case 's': {
      d.setSeconds(d.getSeconds() + val);
      break;
    }
    case 'm': {
      d.setMinutes(d.getMinutes() + val);
      break;
    }
    case 'h': {
      d.setHours(d.getHours() + val);
      break;
    }
    case 'd': {
      d.setDate(d.getDate() + val);
      break;
    }
    case 'M': {
      d.setMonth(d.getMonth() + val);
      break;
    }
  }
  return d.toISOString();
}

const TabTerminal = () => {
  const { t } = useTranslation('strategy');
  const params = useParams<{ id: string }>();
  const { data: signaler } = useSignalerQuery(params.id);
  const [asset, setAsset] = useState<Asset>();

  const { data: candles, isLoading: candlesLoading } = useRecentCandlesQuery(
    asset?.name,
  );

  const { data, isLoading } = useMySignalerOpenPositions(params.id);
  const openPositions = data?.map(p => ({
    ...p,
    suggested_action: p.signal?.action.toUpperCase() as
      | 'CLOSE'
      | 'OPEN'
      | undefined,
  }));
  const activePosition = openPositions?.find(x => x.pair_name === asset?.name);
  const isUpdate = !!activePosition;

  const [market, setMarket] = useState<'long' | 'short'>('long');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [price, setPrice] = useState('');
  const [tp, setTP] = useState('');
  const [sl, setSL] = useState('');
  const [exp, setExp] = useState('1h');
  const [orderExp, setOrderExp] = useState('1h');

  useEffect(() => {
    if (activePosition) {
      setTP(String(activePosition.take_profit));
      setSL(String(activePosition.stop_loss));
    }
  }, [activePosition]);

  const { mutateAsync, isLoading: isSubmitting } = useCreateSignalMutation();

  const isFireDisabled = !asset || !params.id || !price || !tp || !sl;
  const fireHandler = async () => {
    if (!asset || !params.id || !price || !tp || !sl) return;
    try {
      await mutateAsync({
        signalerKey: params.id,
        action: 'open',
        pair: asset.name,
        position: {
          type: signaler?.market_name === 'SPOT' ? 'long' : market,
          order_type: orderType,
          price: {
            value: Number.parseFloat(price),
          },
          suggested_action_expires_at: parseDur(exp),
          order_expires_at: parseDur(orderExp),
        },
        take_profit: {
          price: { value: Number.parseFloat(tp) },
        },
        stop_loss: {
          price: { value: Number.parseFloat(sl) },
        },
      });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  const closeHandler = async () => {
    if (!asset || !params.id || !activePosition?.signal) return;
    try {
      await mutateAsync({
        signalerKey: params.id,
        ...activePosition.signal,
        action: 'close',
      });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  const isUpdateDisabled = !asset || !params.id || !tp || !sl;
  const updateHandler = async () => {
    if (!asset || !params.id || !activePosition?.signal) return;
    try {
      await mutateAsync({
        signalerKey: params.id,
        ...activePosition.signal,
        action: 'open',
        take_profit: {
          price: { value: Number.parseFloat(tp) },
        },
        stop_loss: {
          price: { value: Number.parseFloat(sl) },
        },
      });
    } catch (error) {
      notification.error({ message: unwrapErrorMessage(error) });
    }
  };

  return (
    <div className="mt-12">
      <div className="mb-8 flex flex-col justify-start gap-4 border-b border-white/5 pb-8">
        <AssetSelector
          label="Crypto"
          placeholder="Select Crypto"
          assets={signaler?.assets}
          selectedItem={asset}
          onSelect={setAsset}
          className="w-[250px]"
        />

        {!isLoading && asset && (
          <div className="mt-6">
            <h2 className="mb-3 text-xl text-white/40">
              {signaler?.name} {t('strategy:signaler.active-positions')}
            </h2>
            <ActivePosition position={activePosition} />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        asset && (
          <div className="flex gap-4">
            <div className="basis-2/3 rounded-xl bg-black/20">
              <SimulatedPositionsChart
                candles={candles}
                loading={candlesLoading}
                positions={[]}
              />
            </div>

            <div className="flex basis-1/3 flex-col gap-4">
              {!isUpdate && (
                <>
                  {signaler?.market_name === 'FUTURES' && (
                    <MarketToggle value={market} onChange={setMarket} />
                  )}
                  <div className="flex items-end gap-2">
                    <AmountInputBox
                      label="Price"
                      value={orderType === 'market' ? '-' : price}
                      onChange={setPrice}
                      suffix="USDT"
                      className="grow"
                      disabled={orderType === 'market'}
                    />
                    <OrderTypeToggle
                      value={orderType}
                      onChange={setOrderType}
                    />
                  </div>
                </>
              )}

              <AmountInputBox
                label="Take Profit"
                value={tp}
                onChange={setTP}
                suffix="USDT"
              />
              <AmountInputBox
                label="Stop Loss"
                value={sl}
                onChange={setSL}
                suffix="USDT"
              />

              {!isUpdate && (
                <>
                  <div className="flex items-end gap-2">
                    <DurationInput
                      label="Expiration Time"
                      value={exp}
                      onChange={setExp}
                    />
                    <DurationInput
                      label="Order Expiration Time"
                      value={orderExp}
                      onChange={setOrderExp}
                    />
                  </div>
                </>
              )}

              {isUpdate && (
                <Button
                  variant="alternative"
                  onClick={updateHandler}
                  loading={isSubmitting}
                  disabled={isUpdateDisabled}
                >
                  Update Position
                </Button>
              )}

              <div className="border-b border-white/5" />

              {isUpdate ? (
                <Button
                  variant="secondary-red"
                  onClick={closeHandler}
                  loading={isSubmitting}
                >
                  Close
                </Button>
              ) : (
                <Button
                  variant="green"
                  onClick={fireHandler}
                  loading={isSubmitting}
                  disabled={isFireDisabled}
                >
                  Fire Signal
                </Button>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TabTerminal;
