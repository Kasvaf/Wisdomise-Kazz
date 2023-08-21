import React from 'react';
import { styled } from '@linaria/react';
import { useSignalsQuery } from 'api';
import CoinsIcons from 'shared/CoinsIcons';
import PriceChange from 'shared/PriceChange';
import PriceAreaChart from 'shared/PriceAreaChart';
import PageWrapper from 'modules/base/PageWrapper';
import SignalBox from './SignalBox';

const Signals: React.FC = () => {
  const { data, isLoading } = useSignalsQuery();

  return (
    <PageWrapper loading={isLoading}>
      <div className="mt-2">
        <h1 className="mb-4 text-xl font-semibold text-white">Signalers</h1>
        <p className="mb-6 text-sm font-medium text-white/60">
          Here are the latest positions and suggested actions powered by
          Wisdomise AI
        </p>
      </div>

      <h1 className="mb-7 mt-10 text-xl font-semibold text-white">
        Last Positions
      </h1>
      {data && (
        <div
          className="grid w-min rounded-3xl bg-white/5 px-2 py-4 pb-2"
          style={{
            gridTemplateColumns: `max-content max-content repeat(${data.strategies.length},max-content)`,
          }}
        >
          {[
            'PAIRs',
            '24h %',
            ...(data.strategies.map(s => [
              s.title,
              s.position_sides.join(', '),
            ]) ?? []),
          ].map(e => (
            <div
              key={e.toString()}
              className="border-b border-white/10 py-2 text-center text-xs font-normal text-white"
            >
              {Array.isArray(e) ? (
                <span>
                  {e[0]} <span className="text-white/40">({e[1]})</span>
                </span>
              ) : (
                e
              )}
            </div>
          ))}

          {data.pairs.map(pair => (
            <React.Fragment key={pair.name}>
              <div className="flex items-center justify-center p-2">
                <CoinsIcons coins={[pair.base_name]} />
                <div className="ml-2">
                  <p className="text-sm text-white ">{pair.title}</p>
                  <p className="text-[10px] text-white/40 ">
                    {pair.base_name} / {pair.quote_name}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-2">
                <PriceChange value={pair.time_window_pnl} className="mb-2" />
                <div className="w-36">
                  <PriceAreaChart
                    data={pair.time_window_prices.map((d, i) => ({
                      x: i,
                      y: d,
                    }))}
                  />
                </div>
              </div>
              {data.strategies.map(strategy => {
                const position = data.last_positions.find(
                  p =>
                    p.strategy_name === strategy.name &&
                    pair.name === p.pair_name,
                );

                return (
                  <div
                    key={strategy.name}
                    className="min-h-[149px] min-w-[170px] p-2"
                  >
                    {position == null ? (
                      <EmptySignal />
                    ) : (
                      <SignalBox position={position} />
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

const EmptySignal = styled.div`
  @apply h-full w-full rounded-lg bg-[#131822];
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 15px,
    rgba(255, 255, 255, 0.05) 15px,
    rgba(255, 255, 255, 0.05) 30px
  );
`;

export default Signals;
