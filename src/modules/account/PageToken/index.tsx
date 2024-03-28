import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import PageWrapper from 'modules/base/PageWrapper';
import Vesting from 'modules/account/PageToken/Vesting';
import Migration from 'modules/account/PageToken/Migration';
import { useTwsdmBalance } from 'modules/account/PageToken/web3/twsdm/contract';
import Airdrop from 'modules/account/PageToken/Airdrop';
import ImportTokenButton from 'modules/account/PageToken/ImportTokenButton';
import { useVesting } from 'modules/account/PageToken/web3/tokenDistributer/useVesting';
import Utility from 'modules/account/PageToken/Utility';
import Balance from 'modules/account/PageToken/Balance/Balance';
import Wallet from 'modules/account/PageToken/Wallet';
import ConnectWalletWrapper from '../PageBilling/paymentMethods/Token/ConnectWalletWrapper';

export default function PageToken() {
  const { t } = useTranslation('wisdomise-token');
  const { data: twsdmBalance } = useTwsdmBalance();
  const { isConnected } = useAccount();
  const { angelTotalAmount, strategicTotalAmount } = useVesting();

  return (
    <PageWrapper>
      <div className="my-10 flex flex-wrap items-center justify-between gap-4 md:gap-6">
        <h1 className="text-center">
          <strong className="text-5xl font-semibold text-white/20">
            Wisdomise Token
          </strong>
          <span className="ms-2 text-3xl font-thin text-white/60">
            &quot;WSDM&quot;
          </span>
        </h1>
        {isConnected && (
          <ImportTokenButton
            tokenSymbol="WSDM"
            variant="primary-purple"
            className="max-md:w-full"
          />
        )}
      </div>
      <ConnectWalletWrapper
        title={t('wisdomise-token:connect-wallet.wisdomise-token.title')}
        description={t(
          'wisdomise-token:connect-wallet.wisdomise-token.description',
        )}
      >
        {(twsdmBalance?.value ?? 0n) > 0n && <Migration />}
        {angelTotalAmount || strategicTotalAmount ? <Vesting /> : null}
        <Airdrop />
        <h1 className="my-8 flex flex-wrap items-center justify-between gap-4 text-xl text-white/20">
          <div className="flex items-center gap-2">
            <strong className="text-3xl font-bold">WSDM</strong>
            <span className="ms-2 text-lg">Utility</span>
          </div>
          <ImportTokenButton
            tokenSymbol="lcWSDM"
            variant="primary-purple"
            className="max-md:w-full"
          />
        </h1>
        <Utility />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Wallet />
          <Balance />
        </div>
      </ConnectWalletWrapper>
    </PageWrapper>
  );
}
