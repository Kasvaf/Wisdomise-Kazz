import { useSupportedPairs } from 'api';
import { type AutoTraderSupportedQuotes } from 'api/chains';
import Trader from 'modules/autoTrader/PageTrade/Trader';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import Spinner from 'shared/Spinner';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import PositionsList from 'modules/autoTrader/PagePositions/PositionsList';
import { ReactComponent as TradingIcon } from './TradingIcon.svg';

const TraderSection: React.FC<{ slug: string }> = ({ slug }) => {
  const { data: supportedPairs, isLoading } = useSupportedPairs(slug);
  const [quote, setQuote] = useSearchParamAsState<AutoTraderSupportedQuotes>(
    'quote',
    'tether',
  );

  return (
    <>
      <h3 className="mb-2 text-xxs">Auto Trade</h3>
      <div className="space-y-4 rounded-md bg-v1-surface-l2 p-3 [&_.id-line]:hidden">
        {isLoading ? (
          <div className="m-3 flex justify-center">
            <Spinner />
          </div>
        ) : supportedPairs?.length ? (
          <ActiveNetworkProvider base={slug} quote={quote} setOnLayout>
            <Trader quote={quote} setQuote={setQuote} slug={slug} />
          </ActiveNetworkProvider>
        ) : (
          <div className="my-8 flex flex-col items-center gap-3 text-center text-sm">
            <TradingIcon className="size-8" />
            This coin is currently not tradable on our platform.
          </div>
        )}
      </div>

      <hr className="border-white/10 [&:has(+:not(.id-positions-list))]:hidden" />

      <PositionsList
        slug={slug}
        isOpen
        noEmptyState
        noLoadingState
        className="id-positions-list [&_.id-position-item]:rounded-md"
      />
    </>
  );
};

export default TraderSection;
