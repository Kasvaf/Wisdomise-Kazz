import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { isPositionUpdatable, useTraderPositionQuery } from 'api';
import { type AutoTraderSupportedQuotes } from 'api/chains';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import { CoinSelect } from 'modules/alert/components/CoinSelect';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import PageWrapper from 'modules/base/PageWrapper';
import useIsMobile from 'utils/useIsMobile';
import useEnsureIsSupportedPair from '../useEnsureIsSupportedPair';
import BtnBack from '../../base/BtnBack';
import Trader from './Trader';

export default function PageTrade() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');
  const [quote, setQuote] = useSearchParamAsState<AutoTraderSupportedQuotes>(
    'quote',
    'tether',
  );
  const [positionKey] = useSearchParamAsState('pos');

  useEnsureIsSupportedPair({ slug, nextPage: '/' });

  const position = useTraderPositionQuery({ positionKey });
  useEffect(() => {
    if (!isMobile) {
      navigate(`/coin/${slug}`);
    } else if (position.data && !isPositionUpdatable(position.data)) {
      navigate(`/trader-positions?slug=${slug}`);
    }
  }, [isMobile, navigate, position.data, slug]);

  return (
    <PageWrapper>
      <ActiveNetworkProvider base={slug} quote={quote} setOnLayout>
        <div className="mb-3 flex gap-2">
          <BtnBack />
          <CoinSelect
            className="w-full"
            filterTokens={x => x !== 'tether'}
            priceExchange="auto"
            value={slug}
            tradableCoinsOnly
            onChange={selectedSlug => navigate(`/auto-trader/${selectedSlug}`)}
            mini={false}
          />
        </div>

        <Trader
          slug={slug}
          quote={quote}
          setQuote={setQuote}
          positionKey={positionKey}
        />
      </ActiveNetworkProvider>
    </PageWrapper>
  );
}
