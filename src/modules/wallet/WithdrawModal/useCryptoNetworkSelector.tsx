import { useEffect, useState } from 'react';
import {
  useInvestorAssetStructuresQuery,
  useMarketNetworksQuery,
  useMarketSymbolsQuery,
} from 'api';
import CryptoSelector from '../CryptoSelector';
import NetworkSelector, { type Network } from '../NetworkSelector';

const useCryptoNetworkSelector = () => {
  const ias = useInvestorAssetStructuresQuery();
  const mea = ias.data?.[0]?.main_exchange_account;

  const [crypto, setCrypto] = useState({ name: 'loading', key: '' });
  const cryptos = useMarketSymbolsQuery('withdrawable');
  useEffect(() => {
    const cc = (cryptos.data ?? []).filter(x => x.name === mea?.quote.name);
    if (cc[0]) {
      setCrypto(cc[0]);
    }
  }, [cryptos.data, mea?.quote.name]);

  // ----------------------------------------------------

  const [network, setNetwork] = useState<Network>({
    name: 'loading',
    description: '',
  } as Network);
  const networks = useMarketNetworksQuery({
    usage: 'withdrawable',
    symbol: crypto.name !== 'loading' ? crypto.name : undefined,
    exchangeAccountKey: mea?.key,
  });
  useEffect(() => {
    const nets = networks.data;
    if (!nets) return;
    setNetwork(net => nets.find(n => n.name === net.name) || nets[0]);
  }, [networks.data]);

  const component = (
    <div className="mb-9 flex justify-stretch mobile:flex-col">
      <div className="basis-1/2 mobile:mb-6">
        <div className="mb-1 ml-3">Cryptocurrency</div>
        <CryptoSelector
          cryptos={(cryptos.data ?? []).filter(x => x.name === mea?.quote.name)}
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
          selectedItem={network}
          onSelect={setNetwork}
          disabled={networks.isLoading}
        />
      </div>
    </div>
  );

  return {
    component,
    loading: cryptos.isLoading || networks.isLoading,
    crypto,
    network,
  };
};

export default useCryptoNetworkSelector;
