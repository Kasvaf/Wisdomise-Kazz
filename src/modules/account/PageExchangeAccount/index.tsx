import PageWrapper from 'modules/base/PageWrapper';
import CardWisdomiseAccount from './CardWisdomiseAccount';
import CardExchangeAccounts from './CardExchangeAccounts';

const PageExchangeAccount = () => {
  return (
    <PageWrapper>
      <h1 className="mb-8 text-xl font-semibold">Account Manager</h1>

      <CardWisdomiseAccount />
      <CardExchangeAccounts className="mt-6" />
    </PageWrapper>
  );
};

export default PageExchangeAccount;
