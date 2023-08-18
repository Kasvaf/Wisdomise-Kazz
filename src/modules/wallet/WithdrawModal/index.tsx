import { useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import * as numerable from 'numerable';
import {
  useMarketSymbolsQuery,
  useMarketNetworksQuery,
  useInvestorAssetStructuresQuery,
} from 'api';
import Spinner from 'shared/Spinner';
import TextBox from 'modules/shared/TextBox';
import { roundDown } from 'utils/numbers';
import useModal from 'modules/shared/useModal';
import NetworkSelector, { type Network } from '../NetworkSelector';
import CryptoSelector from '../CryptoSelector';
import ConfirmNetworkModal from './ConfirmNetworkModal';

const InfoLabel = ({
  label,
  value,
  unit,
}: {
  label: string;
  value?: number;
  unit?: string;
}) => {
  return (
    <div className="mb-2 flex justify-between rounded-full bg-black/10 px-4 py-2">
      <div>{label}</div>
      <div>
        {value == null || isNaN(value)
          ? ''
          : numerable.format(value, '0,0.00', {
              rounding: 'floor',
            })}{' '}
        <span className="text-white/40">{unit}</span>
      </div>
    </div>
  );
};

const WithdrawModal = () => {
  const [net, setNet] = useState<Network>({
    name: 'loading',
    description: '',
  } as Network);

  const [crypto, setCrypto] = useState({ name: 'loading', key: '' });
  const [wallet, setWallet] = useState('');

  const ias = useInvestorAssetStructuresQuery();
  const cryptos = useMarketSymbolsQuery('withdrawable');
  useEffect(() => {
    if (cryptos.data?.[0]) {
      setCrypto(cryptos.data[0]);
    }
  }, [cryptos.data]);

  const mea = ias.data?.[0]?.main_exchange_account;
  const networks = useMarketNetworksQuery({
    usage: 'withdrawable',
    symbol: crypto.name !== 'loading' ? crypto.name : undefined,
    exchangeAccountKey: mea?.key,
  });
  useEffect(() => {
    if (networks.data?.[0]) {
      setNet(networks.data[0]);
    }
  }, [networks.data]);
  const getMinMaxWithdrawFee = useMemo(
    () =>
      !networks.data
        ? { min: 0, max: 0 }
        : {
            min: Math.min(
              ...networks.data.map(item =>
                Number(item.binance_info.withdrawFee),
              ),
            ),
            max: Math.max(
              ...networks.data.map(item =>
                Number(item.binance_info.withdrawFee),
              ),
            ),
          },
    [networks.data],
  );

  const getMinimumWithdraw = () => {
    return +(net?.binance_info?.withdrawMin ?? 0);
  };

  const [ConfirmNetwork, openConfirm] = useModal(ConfirmNetworkModal);
  const networkChangeHandler = async (v: Network) => {
    if (await openConfirm({ network: v })) {
      setNet(v);
    }
  };

  return (
    <div className="text-white">
      <h1 className="mb-6 text-center text-xl">Deposit</h1>
      <div className="mb-9 flex justify-stretch mobile:flex-col">
        <div className="basis-1/2 mobile:mb-6">
          <div className="mb-1 ml-3">Cryptocurrency</div>
          <CryptoSelector
            cryptos={cryptos.data ?? []}
            selectedItem={crypto}
            onSelect={setCrypto}
            disabled={cryptos.isLoading}
          />
        </div>

        <div className="w-8 mobile:hidden" />

        <div className="basis-1/2">
          <div className="mb-1 ml-3">Network</div>
          <NetworkSelector
            networks={networks.data}
            selectedItem={net}
            onSelect={networkChangeHandler}
            disabled={networks.isLoading}
          />
          <ConfirmNetwork />
        </div>
      </div>

      <div className="mb-9">
        <div className="mb-1 ml-3">Wallet Address</div>
        <TextBox value={wallet} onChange={setWallet} />
      </div>

      <div className="mb-9">
        <div className="mb-1 ml-3">Amount</div>
        <TextBox
          type="number"
          value={wallet}
          onChange={setWallet}
          suffix="BUSD"
        />
      </div>

      {networks.isLoading || cryptos.isLoading ? (
        <div className="flex justify-center py-2">
          <Spinner />
        </div>
      ) : (
        <div className="mb-9 text-xs">
          <InfoLabel
            label="Available"
            value={mea?.quote_equity ? roundDown(mea.quote_equity) : 0}
            unit={crypto.name}
          />
          <InfoLabel
            label="Min. Withdrawal"
            value={+getMinimumWithdraw()}
            unit={crypto.name}
          />
          <InfoLabel
            label="Network-Fee"
            value={+net?.binance_info?.withdrawFee}
            unit={crypto.name}
          />
        </div>
      )}
    </div>
  );
};

export default WithdrawModal;
