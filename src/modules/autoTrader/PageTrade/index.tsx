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
      navigate(`/trader/positions?slug=${slug}`);
    }
  }, [isMobile, navigate, position.data, slug]);

  return (
    <PageWrapper hasBack>
      <CoinSelect
        className="mb-4 w-full [&_.ant-select-selector]:!bg-v1-surface-l2 [&_.ant-select-selector]:!py-1"
        filterTokens={x => x !== 'tether'}
        priceExchange="auto"
        value={slug}
        tradableCoinsOnly
        onChange={selectedSlug =>
          navigate(`/trader/bot/${selectedSlug}`, { replace: true })
        }
        mini={false}
      />

      <ActiveNetworkProvider base={slug} quote={quote} setOnLayout>
        <Trader
          slug={slug}
          quote={quote}
          setQuote={setQuote}
          positionKey={positionKey}
          loadingClassName="bg-v1-surface-l1"
        />
      </ActiveNetworkProvider>
    </PageWrapper>
  );
}
