import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDisconnect } from 'wagmi';
import ConnectWalletWrapper from 'modules/account/PageBilling/TokenPayment/ConnectWalletWrapper';
import Card from 'shared/Card';
import PageWrapper from 'modules/base/PageWrapper';
import { useAccountQuery, useSubscription } from 'api';
import Button from 'shared/Button';
import { INVESTMENT_FE } from 'config/constants';
import { addComma } from 'utils/numbers';
import { useUpdateTokenBalanceMutation } from 'api/defi';
import CopyInputBox from 'shared/CopyInputBox';
import Vesting from 'modules/account/PageToken/Vesting';
import Migration from 'modules/account/PageToken/Migration';
import { useWsdmBalance } from 'modules/account/PageToken/web3/wsdmContract';
import { useTwsdmBalance } from 'modules/account/PageToken/web3/twsdmContract';
import Airdrop from 'modules/account/PageToken/Airdrop';
import { ReactComponent as WalletIcon } from './icons/wallet.svg';
import { ReactComponent as UtilityIcon } from './icons/utility.svg';
import { ReactComponent as SubscriptionIcon } from './icons/subscription.svg';
// eslint-disable-next-line import/max-dependencies
import { ReactComponent as WSDMIcon } from './icons/wsdm-token.svg';

export default function PageToken() {
  const { t } = useTranslation('wisdomise-token');
  const { isActive, isLoading, isTrialPlan } = useSubscription();
  const { data: account } = useAccountQuery();
  const { mutateAsync: updateBalance, isLoading: isRefreshing } =
    useUpdateTokenBalanceMutation();
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();
  const { data: wsdmBalance } = useWsdmBalance();
  const { data: twsdmBalance } = useTwsdmBalance();

  const openInvestmentPanel = () => {
    window.location.href = INVESTMENT_FE;
  };

  const openBillingPage = () => {
    navigate('/account/billing');
  };

  const updateTokenBalance = async () => {
    await updateBalance();
  };

  const disconnectWallet = () => disconnect();

  return (
    <PageWrapper loading={isLoading}>
      <h1 className="mb-6">
        <strong className="text-5xl font-bold text-white/20">
          Wisdomise Token
        </strong>
        <span className="ms-2 text-3xl text-white/60">&quot;WSDM&quot;</span>
        {/* {t('base:menu.token.title')} */}
      </h1>
      <ConnectWalletWrapper
        title={t('wisdomise-token:connect-wallet.wisdomise-token.title')}
        description={t(
          'wisdomise-token:connect-wallet.wisdomise-token.description',
        )}
      >
        {(twsdmBalance?.value ?? 0n) > 0n && <Migration />}
        <Vesting />
        <Airdrop />
        <h1 className="my-8 text-white/20">
          <strong className="text-3xl font-bold">WSDM</strong>
          <span className="ms-2 text-lg">Utility</span>
          {/* {t('base:menu.token.title')} */}
        </h1>
        <Card className="relative flex flex-col gap-3">
          <SubscriptionIcon className="absolute right-0 top-0" />
          <h2 className="mb-2 text-2xl font-medium">Utility Activation</h2>
          <div className="flex flex-col items-center text-center">
            <strong className="mb-2 font-medium">Activate Subscription</strong>
            <p className="mb-2 text-white/40">
              Lock your $WSDM tokens to gain access to our products.
            </p>
            <div>
              <Button variant="alternative">Lock WSDM</Button>
              <Button variant="link" className="underline">
                Check Services
              </Button>
            </div>
          </div>
        </Card>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
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
                onClick={disconnectWallet}
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
              <Button
                variant="alternative"
                className="bg-gradient-to-bl from-[rgba(97,82,152,0.40)] from-15% to-[rgba(66,66,123,0.40)] to-75% brightness-125"
                onClick={openInvestmentPanel}
              >
                Add WSDM
              </Button>
            </div>
          </Card>
        </div>
        <div className="mt-4 hidden grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="flex flex-col justify-between">
            <div className="flex justify-between">
              <div>
                <h1 className="mb-6 text-xl font-semibold">
                  {t('balance.your-balance')}
                </h1>
                <Button
                  variant="secondary"
                  disabled={isRefreshing}
                  onClick={updateTokenBalance}
                >
                  {t('billing:token-modal.refresh')}
                </Button>
              </div>
              <WalletIcon />
            </div>
            <div className="flex items-center justify-between pt-8">
              <span className="text-3xl font-bold">
                {addComma(wsdmBalance?.value)} {t('balance.token-name')}
              </span>
              <Button onClick={openInvestmentPanel}>
                {t('balance.add-token')}
              </Button>
            </div>
          </Card>
          <Card>
            <div className="flex justify-between">
              <div>
                <h1 className="mb-6 text-xl font-semibold">
                  {t('utility.title')}
                </h1>
                <p className="text-xs text-white/60">
                  {t('utility.description')}
                </p>
              </div>
              <UtilityIcon className="shrink-0" />
            </div>
            <div className="flex items-center justify-between pt-8">
              <span className="text-3xl font-bold">
                {isActive && !isTrialPlan
                  ? t('utility.activated')
                  : t('utility.not-activated')}
              </span>
              {(!isActive || isTrialPlan) && (
                <Button onClick={openBillingPage}>
                  {t('utility.activate')}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </ConnectWalletWrapper>
    </PageWrapper>
  );
}
