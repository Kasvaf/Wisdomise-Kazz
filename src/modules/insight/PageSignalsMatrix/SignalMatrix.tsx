import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSignalsQuery } from 'api';
import PriceAreaChart from 'shared/PriceAreaChart';
import PriceChange from 'shared/PriceChange';
import PairInfo from 'shared/PairInfo';
import Spinner from 'shared/Spinner';
import Card from 'shared/Card';
import SignalBox from './SignalBox';

const SignalMatrix: React.FC = () => {
  const { t } = useTranslation('strategy');
  const { data: signals, isLoading: isLoadingSignals } = useSignalsQuery();
  if (isLoadingSignals) {
    return (
      <div className="mt-8 flex justify-center">
        <Spinner />
      </div>
    );
  }
  if (!signals) return null;

  return (
    <Card
      className="mr-4 grid w-min overflow-hidden bg-black/10 !p-0"
      style={{
        gridTemplateColumns: `max-content max-content repeat(${signals.strategies.length},max-content)`,
      }}
    >
      {[
        t('positions-history.pairs'),
        '24h %',
        ...(signals.strategies.map(s => s.profile?.title || s.name) ?? []),
      ].map(e => (
        <div
          key={e.toString()}
          className="flex h-12 items-center justify-center bg-black/60 text-xs font-normal text-white"
        >
          {e}
        </div>
      ))}

      {signals.pairs.map(pair => (
        <React.Fragment key={pair.name}>
          <PairInfo
            title={pair.display_name}
            base={pair.base.name}
            quote={pair.quote.name}
            name={pair.name}
          />
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
          {signals.strategies.map(strategy => {
            const position = signals.last_positions.find(
              p => p.strategy.key === strategy.key && pair.name === p.pair_name,
            );

            return (
              <div
                key={strategy.name}
                className="min-h-[149px] min-w-[170px] p-2"
              >
                {position == null ? (
                  <div className="h-full w-full rounded-lg bg-white/[.02]" />
                ) : (
                  <SignalBox position={position} />
                )}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </Card>
  );
};

export default SignalMatrix;
