import { useEffect, useState } from 'react';
import { useInvestorAssetStructuresQuery, useMarketNetworksQuery } from 'api';
import { type Network } from 'api/types/NetworksResponse';
import useMainQuote from 'shared/useMainQuote';
import CryptoSelector from './CryptoSelector';
import NetworkSelector from './NetworkSelector';

const useCryptoNetworkSelector = ({
  usage,
}: {
  usage: 'depositable' | 'withdrawable';
}) => {
  const ias = useInvestorAssetStructuresQuery();
  const mea = ias.data?.[0]?.main_exchange_account;
  const mainQuote = useMainQuote();
  const crypto = { name: mainQuote };

  // ----------------------------------------------------

  const [network, setNetwork] = useState<Network>({
    key: '',
    name: 'loading',
    description: '',
  });
  const networks = useMarketNetworksQuery({
    usage,
    symbol: crypto.name,
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
        <CryptoSelector cryptos={[crypto]} selectedItem={crypto} />
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
    loading: ias.isLoading || networks.isLoading,
    crypto,
    network,
  };
};

export default useCryptoNetworkSelector;
