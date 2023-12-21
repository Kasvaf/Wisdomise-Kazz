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
  const { t } = useTranslation('wisdomise-token');
  const { isActive, isLoading, isTrialPlan } = useSubscription();
  const { data: account } = useAccountQuery();
  const { mutateAsync: updateBalance, isLoading: isRefreshing } =
    useUpdateTokenBalanceMutation();
  const navigate = useNavigate();

  const openInvestmentPanel = () => {
    window.location.href = INVESTMENT_FE;
  };

  const openBillingPage = () => {
    navigate('/account/billing');
  };

  const updateTokenBalance = async () => {
    await updateBalance();
  };

  return (
    <PageWrapper loading={isLoading}>
      <h1 className="mb-6 text-xl font-semibold">
        {t('base:menu.token.title')}
      </h1>
      <ConnectWalletWrapper
        title={t('wisdomise-token:connect-wallet.wisdomise-token.title')}
        description={t(
          'wisdomise-token:connect-wallet.wisdomise-token.description',
        )}
      >
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
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
                {addComma(account?.wsdm_balance ?? 0)} {t('balance.token-name')}
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
