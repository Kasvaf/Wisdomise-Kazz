import { useState } from 'react';
import PageWrapper from 'modules/base/PageWrapper';
import CoinSelector from './CoinSelector';
import CoinOverview from './CoinOverview';
import CoinSignalersList from './CoinSignalersList';

export default function PageCoins() {
  const [coin, setCoin] = useState({
    display_name: 'Bitcoin',
    name: 'BTCUSDT',
    base: { name: 'BTC' },
    quote: { name: 'USDT' },
  });

  return (
    <PageWrapper loading={false}>
      <div>
        <CoinSelector
          selectedItem={coin}
          onSelect={setCoin}
          className="mb-8 w-[300px] mobile:w-full"
        />

        <CoinOverview name={coin.name} />

        <div className="my-10 border-b border-white/5" />

        <div>
          <div className="mb-10 text-white/40">
            <h2 className="mb-3 text-2xl font-semibold">Signals Overview</h2>
            <p className="text-sm">
              Check Detail of any Strategy , also you can turn on notification
              by click on bell icon.
            </p>
          </div>

          <CoinSignalersList coin={coin} />
        </div>
      </div>
    </PageWrapper>
  );
}
