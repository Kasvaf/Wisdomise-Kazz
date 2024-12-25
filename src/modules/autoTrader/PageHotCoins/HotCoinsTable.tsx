import { Link } from 'react-router-dom';
import { Image } from 'antd';
import { useHasFlag, useTraderCoins } from 'api';
import { Coin } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableNumber } from 'shared/ReadableNumber';
import Spinner from 'shared/Spinner';
import AlertButton from './AlertButton';
import ton from './ton.svg';

const HotCoinsTable = () => {
  const hasFlag = useHasFlag();

  const { isLoading, data } = useTraderCoins({
    page: 1,
    pageSize: 500,
    filter: undefined,
    networkName: 'ton',
    days: 7,
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 py-3">
          <Image src={ton} alt="ton" />
          TON Hot Coins
        </h1>
        {hasFlag('/trader-alerts') && <AlertButton />}
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {data?.results.map(coin => (
            <Link
              to={`/trader-hot-coins/${coin?.symbol.slug ?? ''}`}
              key={coin.symbol.slug}
              className="flex justify-between rounded-lg bg-v1-surface-l2 p-2"
            >
              <Coin coin={coin.symbol} imageClassName="size-6" nonLink={true} />

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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotCoinsTable;
