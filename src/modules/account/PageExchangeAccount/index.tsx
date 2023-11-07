import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import CardWisdomiseAccount from './CardWisdomiseAccount';
import CardExchangeAccounts from './CardExchangeAccounts';

const PageExchangeAccount = () => {
  const { t } = useTranslation('external-accounts');
  return (
    <PageWrapper>
      <h1 className="mb-8 text-xl font-semibold">
        {t('base:menu.account-manager.title')}
      </h1>

      <CardWisdomiseAccount />
      <CardExchangeAccounts className="mt-6" />
    </PageWrapper>
  );
};

export default PageExchangeAccount;
