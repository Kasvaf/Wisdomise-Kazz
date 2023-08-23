import { clsx } from 'clsx';
import { useCallback } from 'react';
import QRCode from 'react-qr-code';
import { useDepositWalletAddressQuery } from 'api';
import Spinner from 'shared/Spinner';
import useCryptoNetworkSelector from './useCryptoNetworkSelector';

const DepositModal = () => {
  const {
    component: CryptoNetworkSelector,
    loading: cryptoNetLoading,
    crypto,
    network,
  } = useCryptoNetworkSelector({ usage: 'depositable' });

  const depositAddress = useDepositWalletAddressQuery({
    symbol: crypto.name,
    network: network.name === 'loading' ? undefined : network.name,
  });

  const copyToClipboard = useCallback(() => {
    const addr = depositAddress.data?.address;
    if (!addr) return;
    void navigator.clipboard?.writeText(addr);
  }, [depositAddress.data?.address]);

  return (
    <div className="text-white">
      <h1 className="mb-6 text-center text-xl">Deposit</h1>
      {CryptoNetworkSelector}

      {depositAddress.isLoading || cryptoNetLoading ? (
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
              <div
                className="truncate"
                style={{ maxWidth: 'calc(100% - 50px)' }}
              >
                {depositAddress.data?.address}
              </div>
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
