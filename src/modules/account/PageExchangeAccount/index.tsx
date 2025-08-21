import PageWrapper from 'modules/base/PageWrapper';
import { useTranslation } from 'react-i18next';
import YouTube from 'react-youtube';
import Card from 'shared/Card';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useIsMobile from 'utils/useIsMobile';
import CardExchangeAccounts from './CardExchangeAccounts';
import CardWisdomiseAccount from './CardWisdomiseAccount';

const PageExchangeAccount = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('external-accounts');
  return (
    <PageWrapper
      extension={!isMobile && <CoinExtensionsGroup />}
      hasBack
      title={t('base:menu.account-manager.title')}
    >
      <CardWisdomiseAccount />
      <CardExchangeAccounts className="mt-6" />

      <div className="flex justify-center">
        <Card className="mobile:!p-4 mt-6 aspect-video w-[800px] max-w-full">
          <YouTube
            className="h-full w-full"
            opts={{ width: '100%', height: '100%' }}
            videoId="Z0X7FzgaCgw"
          />
        </Card>
      </div>
    </PageWrapper>
  );
};

export default PageExchangeAccount;
