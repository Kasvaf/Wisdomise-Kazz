import { useCoinDetails } from 'api';
import { CoinWhalesWidget } from 'modules/insight/PageWhaleRadar/components/WhaleRadarDesktop/CoinWhalesWidget';

export function CoinWhaleListWidget({
  id,
  slug,
}: {
  id?: string;
  slug: string;
}) {
  const coinOverview = useCoinDetails({ slug });

  if (!coinOverview.data?.symbol) return null;
  return (
    <>
      <CoinWhalesWidget
        coin={coinOverview.data.symbol}
        type="active"
        id={id}
        noEmptyState
      />
      <CoinWhalesWidget
        coin={coinOverview.data.symbol}
        type="holding"
        id={id}
        noEmptyState
      />
    </>
  );
}
