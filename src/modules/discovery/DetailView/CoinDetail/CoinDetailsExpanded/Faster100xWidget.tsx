import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { isLocal } from 'utils/version';

export default function Faster100xWidget({
  className,
  id,
}: {
  className?: string;
  id?: string;
}) {
  const { symbol, isInitiating } = useUnifiedCoinDetails();
  const platform = isLocal ? 'dev' : 'goatx';

  // Show loading state while data is being fetched
  if (isInitiating || !symbol.contractAddress) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="text-neutral-600 text-sm">
            Loading bubble chart...
          </div>
        </div>
      </div>
    );
  }

  return (
    <iframe
      className={className}
      id={id}
      src={`https://faster100x.com/en/lite/embedded?tokenChain=sol&tokenAddress=${symbol.contractAddress}&platform=${platform}&defaultTableOpen=false`}
      title="Faster100xWidget"
    />
  );
}
