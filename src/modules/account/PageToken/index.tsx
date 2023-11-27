import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ConnectWalletWrapper from 'modules/account/PageBilling/TokenPayment/ConnectWalletWrapper';
import Card from 'shared/Card';
import PageWrapper from 'modules/base/PageWrapper';
import { useAccountQuery, useSubscription } from 'api';
import Button from 'shared/Button';
import { INVESTMENT_FE } from 'config/constants';
import { addComma } from 'utils/numbers';
import { useUpdateTokenBalanceMutation } from 'api/defi';
import { ReactComponent as WalletIcon } from './images/wallet.svg';
import { ReactComponent as UtilityIcon } from './images/utility.svg';

export default function PageToken() {
  const { t } = useTranslation();
  const { isActive, isLoading, isTrialPlan } = useSubscription();
  const { data: account } = useAccountQuery();
  const navigate = useNavigate();

  const openInvestmentPanel = () => {
    window.location.href = INVESTMENT_FE;
  };

  const openBillingPage = () => {
    navigate('/account/billing');
  };

  const { mutateAsync: updateBalance } = useUpdateTokenBalanceMutation();

  const updateTokenBalance = async () => {
    await updateBalance();
  };

  return (
    <PageWrapper loading={isLoading}>
      <h1 className="mb-6 text-xl font-semibold">
        {t('base:menu.token.title')}
      </h1>
      <ConnectWalletWrapper>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="flex flex-col justify-between">
            <div className="flex justify-between">
              <div>
                <h1 className="mb-6 text-xl font-semibold">
                  Your tWSDM token balance
                </h1>
                <Button variant="secondary" onClick={updateTokenBalance}>
                  {t('billing:token-modal.refresh')}
                </Button>
              </div>
              <WalletIcon />
            </div>
            <div className="flex items-center justify-between pt-8">
              <span className="text-3xl font-bold">
                {addComma(account?.wsdm_balance ?? 0)} tWSDM
              </span>
              <Button onClick={openInvestmentPanel}>Add tWSDM</Button>
            </div>
          </Card>
          <Card>
            <div className="flex justify-between">
              <div>
                <h1 className="mb-6 text-xl font-semibold">
                  Utility Activation
                </h1>
                <p className="text-xs text-white/60">
                  Unlock exclusive access to Wisdomise’s premium subscription
                  packages for an entire year just by holding onto your $tWSDM
                  tokens. There’s no deduction from your tokens – simply keep
                  them in your wallet. This effortless approach ensures you
                  enjoy all the premium benefits without any additional cost or
                  hassle. It’s a smart way to maximize the value of your
                  investment while exploring the full range of services that
                  Wisdomise has to offer.
                </p>
              </div>
              <UtilityIcon className="shrink-0" />
            </div>
            <div className="flex items-center justify-between pt-8">
              <span className="text-3xl font-bold">
                {isActive && !isTrialPlan ? 'Activated' : 'Not Activated'}
              </span>
              {(!isActive || isTrialPlan) && (
                <Button onClick={openBillingPage}>Activate</Button>
              )}
            </div>
          </Card>
        </div>
      </ConnectWalletWrapper>
    </PageWrapper>
  );
}
