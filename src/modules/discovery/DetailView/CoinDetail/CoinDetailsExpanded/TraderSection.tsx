import TokenActivity from 'modules/autoTrader/TokenActivity';
import TraderTrades from 'modules/autoTrader/TraderTrades';
import { ActiveNetworkProvider } from 'modules/base/active-network';
import { WRAPPED_SOLANA_SLUG } from 'services/chains/constants';
import { useTokenPairsQuery } from 'services/rest';
import Skeleton from 'shared/v1-components/Skeleton';
import { useUnifiedCoinDetails } from '../lib';
import { ReactComponent as TradingIcon } from './TradingIcon.svg';

const TraderSection: React.FC<{
  quote: string;
  setQuote: (newVal: string) => void;
}> = ({ quote, setQuote }) => {
  const { symbol } = useUnifiedCoinDetails();
  const slug = symbol.slug === 'solana' ? WRAPPED_SOLANA_SLUG : symbol.slug;
  const { data: supportedPairs, isLoading, error } = useTokenPairsQuery(slug);

  return (
    <>
      <div className="relative [&_.id-line]:hidden">
        {isLoading ? (
          <TradeSkeleton />
        ) : supportedPairs?.length ? (
          <ActiveNetworkProvider base={slug} quote={quote} setOnLayout>
            <TokenActivity />
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

const TradeSkeleton = () => {
  return (
    <div className="mt-3">
      <Skeleton className="h-[96px] w-full" />
      <hr className="my-3 border-white/10" />
      <Skeleton className="h-[40px] w-full" />
      <Skeleton className="mt-12 h-[40px] w-full" />
      <div className="mt-2 flex items-center justify-between gap-1">
        {new Array(4).fill(0).map((_, i) => (
          <Skeleton className="h-[24px] w-full" key={i} />
        ))}
      </div>
      <Skeleton className="mt-5 h-[40px] w-full" />
      <div className="mt-3 flex items-center gap-1">
        {new Array(3).fill(0).map((_, i) => (
          <Skeleton className="h-[24px] w-10" key={i} />
        ))}
      </div>
      <Skeleton className="mt-12 h-[48px] w-full" />
    </div>
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
