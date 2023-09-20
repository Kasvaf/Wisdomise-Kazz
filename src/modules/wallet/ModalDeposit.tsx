import QRCode from 'react-qr-code';
import { bxInfoCircle } from 'boxicons-quasar';
import { NavLink } from 'react-router-dom';
import { useDepositWalletAddressQuery } from 'api';
import Spinner from 'shared/Spinner';
import Banner from 'shared/Banner';
import CopyInputBox from 'shared/CopyInputBox';
import useCryptoNetworkSelector from './useCryptoNetworkSelector';

const ModalDeposit = () => {
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

  return (
    <div className="text-white">
      <h1 className="mb-10 text-center text-xl">Deposit</h1>
      <Banner icon={bxInfoCircle} className="mb-10">
        You have to Deposit from a Verified wallet. Using an unverified wallet
        will result in your account being{' '}
        <span className="text-warning">restricted</span>.{' '}
        <NavLink className="underline" to="/account/kyc">
          Verify Wallet
        </NavLink>
      </Banner>

      {CryptoNetworkSelector}

      {depositAddress.isLoading || cryptoNetLoading ? (
        <div className="flex justify-center py-2">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="basis-1/2">
            <div className="mb-1 ml-3">Wallet Address</div>
            <CopyInputBox
              value={depositAddress.data?.address}
              className="mb-10"
            />
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

export default ModalDeposit;
