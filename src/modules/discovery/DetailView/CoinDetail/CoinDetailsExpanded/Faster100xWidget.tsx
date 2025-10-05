import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { isProduction } from 'utils/version';

export default function Faster100xWidget({
  className,
}: {
  className?: string;
}) {
  const { symbol } = useUnifiedCoinDetails();
  const platform = isProduction ? 'goatx' : 'dev';

  return (
    <iframe
      className={className}
      src={`https://faster100x.com/en/lite/embedded?tokenChain=sol&tokenAddress=${symbol.contractAddress}&platform=${platform}&defaultTableOpen=false`}
      title="Faster100xWidget"
    />
  );
}
