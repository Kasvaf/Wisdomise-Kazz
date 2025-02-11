import { useParams } from 'react-router-dom';
import { type AutoTraderSupportedQuotes } from 'api/chains';
import { ActiveNetworkProvider } from 'modules/base/active-network';

import useSearchParamAsState from 'shared/useSearchParamAsState';
import Trader from './Trader';

export default function PageTrade() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');
  const [quote] = useSearchParamAsState<AutoTraderSupportedQuotes>(
    'quote',
    'tether',
  );

  return (
    <ActiveNetworkProvider base={slug} quote={quote} setOnLayout>
      <Trader />
    </ActiveNetworkProvider>
  );
}
