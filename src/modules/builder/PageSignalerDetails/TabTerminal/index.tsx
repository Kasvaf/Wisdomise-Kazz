import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Asset, useSignalerQuery } from 'api/builder/signaler';
import { useMySignalerOpenPositions } from 'api/builder/positions';
import Spinner from 'modules/shared/Spinner';
import ActivePosition from 'modules/signaler/ActivePosition';
import SimulatedPositionsChart from 'modules/signaler/SimulatedPositionsChart';
import AmountInputBox from 'modules/shared/AmountInputBox';
import Button from 'modules/shared/Button';
import AssetSelector from '../AssetSelector';
import MarketToggle from './MarketToggle';
import OrderTypeToggle from './OrderTypeToggle';
import DurationInput from './DurationInput';

const TabTerminal = () => {
  const { t } = useTranslation('strategy');
  const params = useParams<{ id: string }>();
  const { data: signaler } = useSignalerQuery(params.id);
  const [asset, setAsset] = useState<Asset>();

  const { data, isLoading } = useMySignalerOpenPositions(params.id);
  const openPositions = data?.map(p => ({
    ...p,
    suggested_action: p.signal?.action.toUpperCase() as
      | 'CLOSE'
      | 'OPEN'
      | undefined,
  }));
  const activePosition = openPositions?.find(x => x.pair_name === asset?.name);

  const [market, setMarket] = useState<'LONG' | 'SHORT'>('LONG');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [price, setPrice] = useState('');
  const [tp, setTP] = useState('');
  const [sl, setSL] = useState('');
  const [exp, setExp] = useState('30s');
  const [orderExp, setOrderExp] = useState('30s');
  const isUpdate = false;

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
              <SimulatedPositionsChart asset={asset.name} positions={[]} />
            </div>

            <div className="flex basis-1/3 flex-col gap-4">
              {!isUpdate && (
                <>
                  <MarketToggle value={market} onChange={setMarket} />
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
                <Button variant="alternative">Update Position</Button>
              )}

              <div className="border-b border-white/5" />

              {isUpdate ? (
                <Button variant="secondary-red">Close</Button>
              ) : (
                <Button variant="green">Fire Signal</Button>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TabTerminal;
