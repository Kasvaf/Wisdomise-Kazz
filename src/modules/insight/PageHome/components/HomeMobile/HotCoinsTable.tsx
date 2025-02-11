import { useState } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { useTraderCoins } from 'api';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Coin } from 'shared/Coin';
import Spinner from 'shared/Spinner';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import AlertButton from './AlertButton';
import CoinPreDetailModal from './CoinPreDetailModal';

const HotCoinsTable = () => {
  const isLoggedIn = useIsLoggedIn();
  const { width } = useWindowSize();

  const { isLoading, data } = useTraderCoins({
    page: 1,
    pageSize: 500,
    filter: undefined,
    days: 7,
  });

  const [detailSlug, setDetailSlug] = useState('');

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 py-3">AutoTrader Hot Coins</h1>
        {isLoggedIn && <AlertButton />}
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {data?.results.map(coin => (
            <div
              onClick={() => setDetailSlug(coin.symbol.slug ?? '')}
              key={coin.symbol.slug}
              className="flex justify-between rounded-lg bg-v1-surface-l2 p-2"
            >
              <Coin
                coin={coin.symbol}
                imageClassName="size-6"
                networks={coin.network_slugs}
                truncate={width - 200}
                nonLink={true}
              />

              <div className="flex flex-col items-end">
                <ReadableNumber
                  value={coin.market_data.current_price}
                  label="$"
                />
                <DirectionalNumber
                  value={coin.market_data.price_change_percentage_24h}
                  showSign
                  className="text-[0.89em]"
                  showIcon={false}
                  label="%"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <CoinPreDetailModal slug={detailSlug} onClose={() => setDetailSlug('')} />
    </div>
  );
};

export default HotCoinsTable;
