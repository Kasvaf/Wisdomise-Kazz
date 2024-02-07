import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageWrapper from 'modules/base/PageWrapper';
import { type SignalerPair, useSignalerPairs } from 'api/signaler';
import CoinSelector from '../CoinSelector';
import CoinOverview from './CoinOverview';
import CoinSignalersList from './CoinSignalersList';

export default function PageCoins() {
  const [searchParams, setSearchParams] = useSearchParams();
  const coins = useSignalerPairs();
  const [coin, setCoin] = useState<SignalerPair>();

  useEffect(() => {
    if (!coin) {
      setCoin(
        coins.data?.find(x => x.name === searchParams.get('coin')) ??
          coins.data?.[0],
      );
    }
  }, [coin, coins.data, searchParams]);

  useEffect(() => {
    if (coin) {
      setSearchParams({ coin: coin.name });
    }
  }, [coin, setSearchParams]);

  return (
    <PageWrapper loading={false}>
      <div>
        <CoinSelector
          coins={coins.data}
          loading={coins.isLoading}
          selectedItem={coin}
          onSelect={setCoin}
          className="mb-8 w-[300px] mobile:w-full"
        />

        {coin && (
          <>
            <CoinOverview name={coin.name} />

            <div className="my-10 border-b border-white/5" />

            <div>
              <div className="mb-10 text-white/40">
                <h2 className="mb-3 text-2xl font-semibold">
                  Signals Overview
                </h2>
                <p className="text-sm">
                  Check Detail of any Strategy , also you can turn on
                  notification by click on bell icon.
                </p>
              </div>

              <CoinSignalersList coin={coin} />
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
