import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import { WhalesOnboarding } from './components/WhalesOnboarding';
import { WhaleTopHoldersWidget } from './components/WhaleTopHoldersWidget';
import { WhaleTopCoinsWidget } from './components/WhaleTopCoinsWidget';

export default function PageWhales() {
  // const { t } = useTranslation('whale');
  return (
    <PageWrapper>
      <div className="grid grid-cols-2 gap-6">
        <PageTitle
          title="Whale Analysis"
          description="Track Top Whales, Hottest Tokens They Hold and Trade, and Market Moves Influenced by Crypto Whales"
          className="col-span-2"
        />
        <WhaleTopHoldersWidget className="col-span-2" />
        <WhaleTopCoinsWidget className="col-span-2" />
      </div>
      <WhalesOnboarding />
    </PageWrapper>
  );
}
