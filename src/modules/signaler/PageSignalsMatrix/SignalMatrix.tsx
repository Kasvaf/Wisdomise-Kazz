import React from 'react';
import { styled } from '@linaria/react';
import { useTranslation } from 'react-i18next';
import { type SignalsResponse } from 'api/types/signalResponse';
import PriceAreaChart from 'shared/PriceAreaChart';
import PriceChange from 'shared/PriceChange';
import PairInfo from 'shared/PairInfo';
import Card from 'modules/shared/Card';
import SignalBox from './SignalBox';

const EmptySignal = styled.div`
  @apply h-full w-full rounded-lg bg-page;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 15px,
    rgba(255, 255, 255, 0.05) 15px,
    rgba(255, 255, 255, 0.05) 30px
  );
`;

const SignalMatrix: React.FC<{ signals: SignalsResponse }> = ({ signals }) => {
  const { t } = useTranslation('strategy');
  return (
    <Card
      className="grid w-min !p-2 !pt-4"
      style={{
        gridTemplateColumns: `max-content max-content repeat(${signals.strategies.length},max-content)`,
      }}
    >
      {[
        t('positions-history.pairs'),
        '24h %',
        ...(signals.strategies.map(s => [
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

      {signals.pairs.map(pair => (
        <React.Fragment key={pair.name}>
          <PairInfo
            title={pair.title}
            base={pair.base_name}
            quote={pair.quote_name}
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
              p =>
                p.strategy_name === strategy.name && pair.name === p.pair_name,
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
    </Card>
  );
};

export default SignalMatrix;
