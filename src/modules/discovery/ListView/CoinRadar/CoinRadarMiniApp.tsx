import { useState } from 'react';
import { useTraderCoins } from 'services/rest';
import { Coin } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';
import Spinner from 'shared/Spinner';
import { useWindowSize } from 'usehooks-ts';
import MiniAppPreDetailModal from './MiniAppPreDetailModal';

export const CoinRadarMiniApp = () => {
  const { width } = useWindowSize();
  const { isLoading, data } = useTraderCoins({
    page: 1,
    pageSize: 500,
    filter: undefined,
    networkName: 'ton',
    days: 7,
  });

  const [detailSlug, setDetailSlug] = useState('');

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 py-3">AutoTrader Hot Coins</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {data?.results.map(coin => (
            <div
              className="flex justify-between rounded-lg bg-v1-surface-l2 p-2"
              key={coin.symbol.slug}
              onClick={() => setDetailSlug(coin.symbol.slug ?? '')}
            >
              <Coin
                coin={coin.symbol}
                imageClassName="size-6"
                networks={coin.network_slugs}
                nonLink={true}
                truncate={width - 200}
              />

              <div className="flex flex-col items-end">
                <ReadableNumber
                  label="$"
                  value={coin.market_data?.current_price}
                />
                <DirectionalNumber
                  className="text-[0.89em]"
                  label="%"
                  showIcon={false}
                  showSign
                  value={coin.market_data?.price_change_percentage_24h}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <MiniAppPreDetailModal
        onClose={() => setDetailSlug('')}
        slug={detailSlug}
      />
    </div>
  );
};
