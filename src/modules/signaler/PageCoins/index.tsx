import PageWrapper from 'modules/base/PageWrapper';
import { useSignalerPairs } from 'api/signaler';
import { useRecentCandlesQuery } from 'api';
import useSearchParamAsState from 'modules/shared/useSearchParamAsState';
import CandleChart from 'modules/strategy/PageStrategyDetails/TabPositions/CandleChart';
import CoinSelector from '../CoinSelector';
import CoinOverview from './CoinOverview';
import CoinSignalersList from './CoinSignalersList';

export default function PageCoins() {
  const coins = useSignalerPairs();
  const [coinName, setCoinName] = useSearchParamAsState(
    'coin',
    () => coins.data?.[0].name ?? '',
  );
  const coin = coins.data?.find(c => c.name === coinName);
  const { data: candles, isLoading: candlesLoading } = useRecentCandlesQuery(
    coin?.base.name,
  );

  return (
    <PageWrapper loading={false}>
      <div>
        <CoinSelector
          coins={coins.data}
          loading={coins.isLoading}
          selectedItem={coin}
          onSelect={c => setCoinName(c.name)}
          className="mb-8 w-[300px] mobile:w-full"
        />

        {coin && (
          <>
            <CoinOverview name={coin.name} />

            <div className="my-10 border-b border-white/5" />

            <div className="mb-10 text-white/40">
              <h2 className="mb-3 text-2xl font-semibold">Signals Overview</h2>
              <p className="text-sm">
                Check Detail of any Strategy , also you can turn on notification
                by click on bell icon.
              </p>
            </div>
            <CoinSignalersList coin={coin} />

            {candles && !candlesLoading && (
              <CandleChart candles={candles} resolution="1h" />
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
