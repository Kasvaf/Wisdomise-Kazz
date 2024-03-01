import { useTranslation } from 'react-i18next';
import { useAccount, useDisconnect } from 'wagmi';
import Card from 'shared/Card';
import PageWrapper from 'modules/base/PageWrapper';
import { useAccountQuery } from 'api';
import Button from 'shared/Button';
import { INVESTMENT_FE } from 'config/constants';
import { addComma } from 'utils/numbers';
import CopyInputBox from 'shared/CopyInputBox';
import Vesting from 'modules/account/PageToken/Vesting';
import Migration from 'modules/account/PageToken/Migration';
import { useWsdmBalance } from 'modules/account/PageToken/web3/wsdm/wsdmContract';
import { useTwsdmBalance } from 'modules/account/PageToken/web3/twsdm/twsdmContract';
import Airdrop from 'modules/account/PageToken/Airdrop';
import ImportTokenButton from 'modules/account/PageToken/ImportTokenButton';
import { useVesting } from 'modules/account/PageToken/web3/useVesting';
import Utility from 'modules/account/PageToken/Utility';
import ConnectWalletWrapper from '../PageBilling/paymentMethods/Token/ConnectWalletWrapper';
import { ReactComponent as WalletIcon } from './icons/wallet.svg';
// eslint-disable-next-line import/max-dependencies
import { ReactComponent as WSDMIcon } from './icons/wsdm-token.svg';

export default function PageToken() {
  const { t } = useTranslation('wisdomise-token');
  const { data: account } = useAccountQuery();
  const { disconnect } = useDisconnect();
  const { data: wsdmBalance } = useWsdmBalance();
  const { data: twsdmBalance } = useTwsdmBalance();
  const { isConnected } = useAccount();
  const { angelTotalAmount, strategicTotalAmount } = useVesting();

  const openInvestmentPanel = () => {
    window.location.href = INVESTMENT_FE;
  };

  return (
    <PageWrapper>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <h1 className="mb-6">
          <strong className="text-5xl font-bold text-white/20">
            Wisdomise Token
          </strong>
          <span className="ms-2 text-3xl text-white/60">&quot;WSDM&quot;</span>
        </h1>
        {isConnected && <ImportTokenButton />}
      </div>
      <ConnectWalletWrapper
        title={t('wisdomise-token:connect-wallet.wisdomise-token.title')}
        description={t(
          'wisdomise-token:connect-wallet.wisdomise-token.description',
        )}
      >
        {(twsdmBalance?.value ?? 0n) > 0n && <Migration />}
        {/* <Migration /> */}
        {angelTotalAmount || strategicTotalAmount ? <Vesting /> : null}
        {/* <Vesting /> */}
        <Airdrop />
        <h1 className="my-8 text-white/20">
          <strong className="text-3xl font-bold">WSDM</strong>
          <span className="ms-2 text-lg">Utility</span>
        </h1>
        <Utility />
        <div className="mb-20 mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="relative flex flex-col justify-between gap-8">
            <WalletIcon className="absolute right-0 top-0 m-7" />
            <h2 className="mb-2 text-2xl font-medium">My Wallet</h2>
            <div className="flex items-end gap-6">
              <CopyInputBox
                className="-mb-6 grow"
                value={account?.wallet_address}
                label="Connected Wallet"
                style="alt"
              />
              <Button
                className="-mb-1"
                variant="alternative"
                onClick={() => disconnect()}
              >
                {t('connect-wallet.disconnect')}
              </Button>
            </div>
          </Card>
          <Card className="relative flex flex-col items-start justify-between gap-8">
            <WSDMIcon className="absolute right-0 top-0" />
            <div>
              <h2 className="mb-2 text-2xl font-medium">WSDM Token</h2>
              <p className="text-white/40">Use tokens for premium access</p>
            </div>
            {/* <Button */}
            {/*  variant="alternative" */}
            {/*  disabled={isRefreshing} */}
            {/*  onClick={updateTokenBalance} */}
            {/*  className="!px-4 !py-2" */}
            {/* > */}
            {/*  <Icon name={bxRefresh} className="me-2" /> */}
            {/*  {t('billing:token-modal.refresh')} */}
            {/* </Button> */}
            <div className="flex w-full items-end justify-between gap-4">
              <div>
                <div>Balance</div>
                <div className="flex flex-wrap items-end gap-2">
                  <span className="text-3xl">
                    {addComma((wsdmBalance?.value ?? 0n) / 10n ** 6n)}
                  </span>
                  <span className="text-xl text-green-400">WSDM</span>
                </div>
              </div>
              <Button variant="primary-purple" onClick={openInvestmentPanel}>
                Add WSDM
              </Button>
            </div>
          </Card>
        </div>
      </ConnectWalletWrapper>
    </PageWrapper>
  );
}
