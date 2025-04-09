import { useTranslation } from 'react-i18next';
import YouTube from 'react-youtube';
import PageWrapper from 'modules/base/PageWrapper';
import Card from 'shared/Card';
import CardWisdomiseAccount from './CardWisdomiseAccount';
import CardExchangeAccounts from './CardExchangeAccounts';

const PageExchangeAccount = () => {
  const { t } = useTranslation('external-accounts');
  return (
    <PageWrapper hasBack title={t('base:menu.account-manager.title')}>
      <CardWisdomiseAccount />
      <CardExchangeAccounts className="mt-6" />

      <div className="flex justify-center">
        <Card className="mt-6 aspect-video w-[800px] max-w-full mobile:!p-4">
          <YouTube
            className="h-full w-full"
            videoId="Z0X7FzgaCgw"
            opts={{ width: '100%', height: '100%' }}
          />
        </Card>
      </div>
    </PageWrapper>
  );
};

export default PageExchangeAccount;
