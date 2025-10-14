import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { isLocal } from 'utils/version';

export default function Faster100xWidget({
  className,
  id,
}: {
  className?: string;
  id?: string;
}) {
  const { symbol } = useUnifiedCoinDetails();
  const platform = isLocal ? 'dev' : 'goatx';

  return (
    <iframe
      className={className}
      id={id}
      src={`https://faster100x.com/en/lite/embedded?tokenChain=sol&tokenAddress=${symbol.contractAddress}&platform=${platform}&defaultTableOpen=false`}
      title="Faster100xWidget"
    />
  );
}
