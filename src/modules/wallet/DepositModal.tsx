import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import QRCode from 'react-qr-code';
import ComboBox from 'shared/ComboBox';
import { CoinsIcons } from 'shared/CoinsIcons';
import {
  useDepositNetworksQuery,
  useDepositSymbolsQuery,
  useDepositWalletAddressQuery,
} from 'api';
import { type CryptosResponse } from 'api/types/NetworksResponse';
import Spinner from 'shared/Spinner';
interface Network {
  name: string;
  description: string;
}

const NetworkOptionItemFn = (item: Network) => {
  return (
    <div className="flex flex-col justify-center">
      <div className="font-medium leading-normal">{item.name}</div>
      <div className="text-[10px] leading-normal text-white/80">
        {item.description}
      </div>
    </div>
  );
};

const CryptoOptionItem = (item: CryptosResponse['results'][0]) => {
  return (
    <div className="flex items-center">
      <div className="my-2 mr-2 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white">
        <CoinsIcons coins={[item.name]} size={'small'} />
      </div>
      <div className="text-lg font-semibold">{item.name}</div>
    </div>
  );
};

const DepositModal = () => {
  const [net, setNet] = useState({ name: 'loading', description: '' });
  const [crypto, setCrypto] = useState({ name: 'loading', key: '' });

  const cryptos = useDepositSymbolsQuery();
  useEffect(() => {
    if (cryptos.data?.[0]) {
      setCrypto(cryptos.data[0]);
    }
  }, [cryptos.data]);

  const networks = useDepositNetworksQuery({
    symbol: crypto.name !== 'loading' ? crypto.name : undefined,
  });
  useEffect(() => {
    if (networks.data?.[0]) {
      setNet(networks.data[0]);
    }
  }, [networks.data]);

  const depositAddress = useDepositWalletAddressQuery({
    symbol: crypto.name,
    network: net.name !== 'loading' ? net.name : undefined,
  });

  const copyToClipboard = () => {
    const addr = depositAddress.data?.address;
    if (!addr) return;
    void navigator.clipboard?.writeText(addr);
  };

  return (
    <div className="text-white">
      <h1 className="mb-6 text-center text-xl">Attention</h1>
      <div className="mb-10 flex justify-stretch">
        <div className="basis-1/2">
          <div className="mb-1 ml-3">Cryptocurrency</div>
          <ComboBox
            options={cryptos.data ?? []}
            selectedItem={crypto}
            onSelect={setCrypto}
            renderItem={CryptoOptionItem}
            disabled={cryptos.isLoading}
          />
        </div>

        <div className="w-8" />

        <div className="basis-1/2">
          <div className="mb-1 ml-3">Network</div>
          <ComboBox
            options={networks.data ?? []}
            selectedItem={net}
            onSelect={setNet}
            renderItem={NetworkOptionItemFn}
            disabled={networks.isLoading}
          />
        </div>
      </div>

      {depositAddress.isLoading || networks.isLoading || cryptos.isLoading ? (
        <div className="flex justify-center py-2">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="basis-1/2">
            <div className="mb-1 ml-3">Wallet Address</div>
            <div
              className={clsx(
                'mb-10 flex h-12 rounded-full',
                'items-center justify-between',
                'bg-white px-6 text-sm text-black',
                'cursor-pointer hover:bg-white/80',
              )}
              onClick={copyToClipboard}
            >
              <div>{depositAddress.data?.address}</div>
              <div className="font-medium">Copy</div>
            </div>
          </div>

          {depositAddress.data && (
            <div className="flex items-stretch justify-start">
              <div className="h-[150px] w-[150px] shrink-0 rounded bg-white p-4">
                <QRCode
                  size={180}
                  className="h-full w-full"
                  value={depositAddress.data.address}
                  viewBox={'0 0 256 256'}
                />
              </div>

              <div className="ml-4 flex shrink flex-col items-start justify-between">
                <p className="text-base font-medium text-white">
                  Send only <strong>{depositAddress.data.coin}</strong> to this
                  deposit address.
                </p>

                <p className="text-sm text-gray-light">
                  Sending coin or token other than {depositAddress.data?.coin}{' '}
                  to this address may result in the loss of your deposit.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DepositModal;
