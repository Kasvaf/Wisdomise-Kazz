import QRCode from 'react-qr-code';
import { Trans, useTranslation } from 'react-i18next';
import { useDepositWalletAddressQuery } from 'api';
import Spinner from 'shared/Spinner';
import CopyInputBox from 'shared/CopyInputBox';
import useCryptoNetworkSelector from './useCryptoNetworkSelector';

const ModalDeposit: React.FC<{ onResolve?: () => void }> = () => {
  const { t } = useTranslation('wallet');
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
      <h1 className="mb-10 text-center text-xl">{t('modal-deposit.title')}</h1>
      {CryptoNetworkSelector}

      {depositAddress.isLoading || cryptoNetLoading ? (
        <div className="flex justify-center py-2">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="basis-1/2">
            <div className="mb-1 ml-3">{t('wallet-address')}</div>
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
                  <Trans i18nKey="modal-deposit.deposit-address" ns="wallet">
                    Send only
                    <strong>{{ coin: depositAddress.data.coin }}</strong> to
                    this deposit address.
                  </Trans>
                </p>

                <p className="text-sm text-gray-light">
                  <Trans i18nKey="modal-deposit.disclaimer" ns="wallet">
                    Sending coin or token other than
                    {{ coin: depositAddress.data.coin }}
                    to this address may result in the loss of your deposit.
                  </Trans>
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
