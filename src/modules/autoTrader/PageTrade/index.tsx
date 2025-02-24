import { useParams } from 'react-router-dom';
import { type AutoTraderSupportedQuotes } from 'api/chains';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import PageWrapper from 'modules/base/PageWrapper';
import useIsMobile from 'utils/useIsMobile';
import PageNoDesktop from '../PageNoDesktop';
import Trader from './Trader';

export default function PageTrade() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');
  const [quote] = useSearchParamAsState<AutoTraderSupportedQuotes>(
    'quote',
    'tether',
  );

  if (!useIsMobile()) {
    return <PageNoDesktop />;
  }

  return (
    <PageWrapper>
      <ActiveNetworkProvider base={slug} quote={quote} setOnLayout>
        <Trader />
      </ActiveNetworkProvider>
    </PageWrapper>
  );
}
