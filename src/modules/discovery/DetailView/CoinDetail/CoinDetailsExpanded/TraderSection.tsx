import { useSupportedPairs } from 'api';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import Spinner from 'shared/Spinner';
import TraderTrades from 'modules/autoTrader/TraderTrades';
import { ReactComponent as TradingIcon } from './TradingIcon.svg';

const TraderSection: React.FC<{
  slug: string;
  quote: string;
  setQuote: (newVal: string) => void;
}> = ({ slug, quote, setQuote }) => {
  const { data: supportedPairs, isLoading, error } = useSupportedPairs(slug);

  return (
    <>
      <div className="relative space-y-4 [&_.id-line]:hidden">
        {isLoading ? (
          <div className="m-3 flex justify-center">
            <Spinner />
          </div>
        ) : supportedPairs?.length ? (
          <ActiveNetworkProvider base={slug} quote={quote} setOnLayout>
            <TraderTrades
              quote={quote}
              setQuote={setQuote}
              slug={slug}
              loadingClassName="bg-v1-surface-l1"
            />
          </ActiveNetworkProvider>
        ) : (
          <NotTradable error={error} />
        )}
      </div>
    </>
  );
};

export const NotTradable = ({ error }: { error: Error | null }) => {
  return error ? (
    <div className="my-8 flex flex-col items-center gap-3 text-center text-sm">
      <TradingIcon className="size-8" />
      We had an issue contacting our servers. Please try again later.
    </div>
  ) : (
    <div className="my-8 flex flex-col items-center gap-3 text-center text-sm">
      <TradingIcon className="size-8" />
      This coin is currently not tradable on our platform.
    </div>
  );
};

export default TraderSection;
