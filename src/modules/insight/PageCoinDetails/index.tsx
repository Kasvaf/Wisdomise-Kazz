import { useParams } from 'react-router-dom';
import useIsMobile from 'utils/useIsMobile';
import PageWrapper from 'modules/base/PageWrapper';
import { GlobalSearchBar } from 'shared/GlobalSearchBar';
import { CoinDetailsMeta } from './components/CoinDetailsMeta';
import { CoinDetailsDesktop } from './components/CoinDetailsDesktop';
import { CoinDetailsMobile } from './components/CoinDetailsMobile';

export default function PageCoinDetails() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');
  const isMobile = useIsMobile();

  return (
    <PageWrapper
      hasBack
      extension={
        <GlobalSearchBar
          size="xs"
          selectorSurface={isMobile ? 2 : 3}
          buttonSurface={isMobile ? 1 : 2}
        />
      }
      mainClassName={isMobile ? '' : '!py-0'}
    >
      <CoinDetailsMeta slug={slug} />
      {isMobile ? (
        <CoinDetailsMobile slug={slug} />
      ) : (
        <CoinDetailsDesktop slug={slug} />
      )}
    </PageWrapper>
  );
}
