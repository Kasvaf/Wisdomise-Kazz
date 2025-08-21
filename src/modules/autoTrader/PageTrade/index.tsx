import { isPositionUpdatable, useTraderPositionQuery } from 'api';
import { CoinSelect } from 'modules/alert/components/CoinSelect';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import PageWrapper from 'modules/base/PageWrapper';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CoinExtensionsGroup } from 'shared/CoinExtensionsGroup';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import useIsMobile from 'utils/useIsMobile';
import { useActiveQuote } from '../useActiveQuote';
import useEnsureIsSupportedPair from '../useEnsureIsSupportedPair';
import Trader from './Trader';

export default function PageTrade() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { getUrl } = useDiscoveryRouteMeta();
  const { slug } = useParams<{ slug: string }>();
  if (!slug) throw new Error('unexpected');
  const [quote, setQuote] = useActiveQuote();
  const [positionKey] = useSearchParamAsState('pos');

  useEnsureIsSupportedPair({ slug, nextPage: '/' });

  const position = useTraderPositionQuery({ positionKey });
  useEffect(() => {
    if (!isMobile) {
      navigate(
        getUrl({
          detail: 'coin',
          slug,
          view: 'both',
        }),
      );
    } else if (position.data && !isPositionUpdatable(position.data)) {
      navigate(getUrl({ list: 'positions', slug, view: 'both' }));
    }
  }, [getUrl, isMobile, navigate, position.data, slug]);

  return (
    <PageWrapper
      className="relative"
      extension={!isMobile && <CoinExtensionsGroup />}
      hasBack
    >
      <CoinSelect
        className="[&_.ant-select-selector]:!bg-v1-surface-l2 [&_.ant-select-selector]:!py-1 mb-4 w-full"
        filterTokens={x => x !== 'tether'}
        mini={false}
        onChange={selectedSlug =>
          navigate(`/trader/bot/${selectedSlug}`, { replace: true })
        }
        showPrice
        tradableCoinsOnly
        value={slug}
      />

      <ActiveNetworkProvider base={slug} quote={quote} setOnLayout>
        <Trader
          loadingClassName="bg-v1-surface-l1"
          positionKey={positionKey}
          quote={quote}
          setQuote={setQuote}
          slug={slug}
        />
      </ActiveNetworkProvider>
    </PageWrapper>
  );
}
