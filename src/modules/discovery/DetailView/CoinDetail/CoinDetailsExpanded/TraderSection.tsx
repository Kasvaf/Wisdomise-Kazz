import { useTokenPairsQuery } from 'api';
import CoinSwapActivity from 'modules/autoTrader/CoinSwapActivity';
import TraderTrades from 'modules/autoTrader/TraderTrades';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import Spinner from 'shared/Spinner';
import { useUnifiedCoinDetails } from '../lib';
import { ReactComponent as TradingIcon } from './TradingIcon.svg';

const TraderSection: React.FC<{
  quote: string;
  setQuote: (newVal: string) => void;
}> = ({ quote, setQuote }) => {
  const { symbol } = useUnifiedCoinDetails();
  const slug = symbol.slug === 'solana' ? 'wrapped-solana' : symbol.slug;
  const { data: supportedPairs, isLoading, error } = useTokenPairsQuery(slug);

  return (
    <>
      <div className="relative [&_.id-line]:hidden">
        {isLoading ? (
          <div className="m-3 flex justify-center">
            <Spinner />
          </div>
        ) : supportedPairs?.length ? (
          <ActiveNetworkProvider base={slug} quote={quote} setOnLayout>
            <CoinSwapActivity />
            <TraderTrades
              loadingClassName="bg-v1-surface-l1"
              quote={quote}
              setQuote={setQuote}
              slug={slug}
            />
          </ActiveNetworkProvider>
        ) : (
          <NotTradable error={error} />
        )}
      </div>
    </>
  );
};

const NotTradable = ({ error }: { error: Error | null }) => {
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
