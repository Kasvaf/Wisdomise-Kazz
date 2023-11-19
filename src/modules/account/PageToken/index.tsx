import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ConnectWalletWrapper from 'modules/account/PageBilling/TokenPayment/ConnectWalletWrapper';
import Card from 'shared/Card';
import PageWrapper from 'modules/base/PageWrapper';
import { useAccountQuery, useSubscription } from 'api';
import Button from 'shared/Button';
import { INVESTMENT_FE } from 'config/constants';
import { addComma } from 'utils/numbers';
import { ReactComponent as WalletIcon } from './images/wallet.svg';
import { ReactComponent as UtilityIcon } from './images/utility.svg';

export default function PageToken() {
  const { t } = useTranslation();
  const { isActive, isLoading } = useSubscription();
  const { data: account } = useAccountQuery();
  const navigate = useNavigate();

  const openInvestmentPanel = () => {
    window.location.href = INVESTMENT_FE;
  };

  const openBillingPage = () => {
    navigate('/account/billing');
  };

  return (
    <PageWrapper loading={isLoading}>
      <h1 className="mb-6 text-xl font-semibold">
        {t('base:menu.token.title')}
      </h1>
      <ConnectWalletWrapper>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <div className="flex justify-between">
              <h1 className="mb-6 text-xl font-semibold">
                Your tWSDM token balance
              </h1>
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
              <h1 className="mb-6 text-xl font-semibold">Utility Activation</h1>
              <UtilityIcon />
            </div>
            <div className="flex items-center justify-between pt-8">
              <span className="text-3xl font-bold">
                {isActive ? 'Activated' : 'Not Activated'}
              </span>
              {!isActive && <Button onClick={openBillingPage}>Activate</Button>}
            </div>
          </Card>
        </div>
      </ConnectWalletWrapper>
    </PageWrapper>
  );
}
