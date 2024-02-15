import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import {
  usePairSignalers,
  useSignalerPairDetails,
  useSignalerPairs,
} from 'api/signaler';
import { useRecentCandlesQuery } from 'api';
import useIsMobile from 'utils/useIsMobile';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import CandleChart from 'modules/strategy/PageStrategyDetails/TabPositions/CandleChart';
import Spinner from 'modules/shared/Spinner';
import CoinSelector from '../CoinSelector';
import CoinOverview from './CoinOverview';
import CoinSignalersList from './CoinSignalersList';

export default function PageCoins() {
  const { t } = useTranslation('strategy');
  const isMobile = useIsMobile();

  const coins = useSignalerPairs();
  const [coinName, setCoinName] = useSearchParamAsState<string>(
    'coin',
    'SOLUSDT',
  );
  const coin = coins.data?.find(c => c.name === coinName);

  const { data: coinDetails, isLoading: detailsLoading } =
    useSignalerPairDetails(coinName);

  const { data: signalers, isLoading: signalersLoading } = usePairSignalers(
    coin?.base.name,
    coin?.quote.name,
  );

  const { data: candles, isLoading: candlesLoading } = useRecentCandlesQuery(
    coin?.base.name,
  );

  const loading = candlesLoading || detailsLoading || signalersLoading;

  return (
    <PageWrapper>
      <div>
        <CoinSelector
          coins={coins.data}
          loading={coins.isLoading}
          selectedItem={coin}
          onSelect={c => setCoinName(c.name)}
          className="mb-8 w-[320px] mobile:w-full"
        />

        {loading ? (
          <div className="flex h-full w-full items-center justify-center text-white mobile:h-[calc(100vh-10rem)]">
            <Spinner />
          </div>
        ) : (
          coin &&
          coinDetails && (
            <>
              <CoinOverview details={coinDetails} />

              <div className="my-10 border-b border-white/5" />

              <div className="mb-10 text-white/40">
                <h2 className="mb-3 text-2xl font-semibold">
                  {t('signaler.signals-overview.title')}
                </h2>
                <p className="text-sm">
                  {t('signaler.signals-overview.description')}
                </p>
              </div>

              <CoinSignalersList signalers={signalers} />
              {candles && !isMobile && (
                <CandleChart candles={candles} resolution="1h" />
              )}
            </>
          )
        )}
      </div>
    </PageWrapper>
  );
}
