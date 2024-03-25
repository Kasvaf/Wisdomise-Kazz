import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCoinTelegramSignals, useSignalsQuery } from 'api';
import PriceAreaChart from 'shared/PriceAreaChart';
import PriceChange from 'shared/PriceChange';
import PairInfo from 'shared/PairInfo';
import Spinner from 'shared/Spinner';
import Card from 'shared/Card';
import SignalBox from './SignalBox';
import RadarBrief from './RadarBrief';

const SignalMatrix: React.FC = () => {
  const { t } = useTranslation('strategy');
  const { data: radar } = useCoinTelegramSignals();
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
      className="grid w-min overflow-hidden bg-black/10 !p-0"
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
          <div className="col-span-2 flex flex-col items-stretch justify-center">
            <div className="flex w-full items-center justify-between">
              <Link
                to={`/insight/coins?coin=${pair.name}`}
                className="flex max-w-[120px] items-center pl-2"
              >
                <PairInfo
                  title={pair.display_name}
                  base={pair.base.name}
                  quote={pair.quote.name}
                  name={pair.name}
                />
              </Link>
              <div className="flex flex-col items-center justify-center p-2">
                <PriceChange value={pair.time_window_pnl} className="mb-2" />
                <div className="w-24">
                  <PriceAreaChart
                    data={pair.time_window_prices.map((d, i) => ({
                      x: i,
                      y: d,
                    }))}
                    height={28}
                  />
                </div>
              </div>
            </div>
            <div className="px-2">
              <RadarBrief
                radar={radar?.find(x => x.symbol_name === pair.base.name)}
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
                className="flex min-h-[144px] min-w-[170px] items-center justify-center p-2"
              >
                {position == null ? (
                  <div className="h-[112px] w-[200px] rounded-lg bg-white/[.02]" />
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
