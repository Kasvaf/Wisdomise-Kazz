import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCoinSignals, useSignalerPairs, useSignalsQuery } from 'api';
import uniqueBy from 'utils/uniqueBy';
import PriceAreaChart from 'shared/PriceAreaChart';
import PriceChange from 'shared/PriceChange';
import PairInfo from 'shared/PairInfo';
import Spinner from 'shared/Spinner';
import Card from 'shared/Card';
import SignalBox from './SignalBox';
import RadarBrief from './RadarBrief';

const SignalMatrix: React.FC = () => {
  const { t } = useTranslation('strategy');
  const { data: radar } = useCoinSignals();
  const {
    data: { last_positions: positions } = {},
    isLoading: isLoadingSignals,
  } = useSignalsQuery();
  const { data: pairs, isLoading: isLoadingPairs } = useSignalerPairs();

  const strategies = useMemo(
    () =>
      uniqueBy(positions?.map(x => x.strategy) ?? [], x => x.key)?.sort(
        (a, b) =>
          (a.profile?.weight ?? 1e5) - (b.profile?.weight ?? 1e5) ||
          (a.profile?.title || a.name).localeCompare(
            b.profile?.title || b.name,
          ),
      ),
    [positions],
  );

  const pairsInfo = useMemo(
    () =>
      pairs
        ?.filter(p => positions?.some(lp => lp.pair_name === p.name))
        .map(pair => ({
          pair,
          social: radar?.find(x => x.symbol_name === pair.base.name),
        }))
        .sort(
          (a, b) =>
            // (b.social?.messages_count ?? 0) - (a.social?.messages_count ?? 0) ||
            (b.pair.time_window_prices.at(-1) ?? 0) -
            (a.pair.time_window_prices.at(-1) ?? 0),
        ) ?? [],
    [pairs, positions, radar],
  );

  if (isLoadingSignals || isLoadingPairs) {
    return (
      <div className="mt-8 flex justify-center">
        <Spinner />
      </div>
    );
  }
  if (!positions || !pairs) return null;

  return (
    <Card
      className="grid w-min overflow-hidden bg-black/10 !p-0"
      style={{
        gridTemplateColumns: `max-content max-content repeat(${strategies.length},max-content)`,
      }}
    >
      {[
        t('positions-history.pairs'),
        '24h %',
        ...(strategies.map(s => s.profile?.title || s.name) ?? []),
      ].map(e => (
        <div
          key={e.toString()}
          className="flex h-12 items-center justify-center bg-black/60 text-xs font-normal text-white"
        >
          {e}
        </div>
      ))}

      {pairsInfo.map(({ pair, social: radar }) => (
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
              <RadarBrief radar={radar} />
            </div>
          </div>
          {strategies.map(strategy => {
            const position = positions.find(
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
