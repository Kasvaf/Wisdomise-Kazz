import CoinsIcons from 'modules/shared/CoinsIcons';
import PriceChange from 'modules/shared/PriceChange';
import { WidgetWrapper } from '../WidgetWrapper';
import { SignalBox } from './SignalBox';
import { Notification } from './components/Notification';
import { PriceAreaChart } from './components/PriceAreaChart';
import { VirtualWallet } from './components/VirtualWallet';
import LastPositionsIconSrc from './icons/lastPositions.svg';
import { ReactComponent as LoadingIcon } from './icons/loading.svg';
import { useSignalsQuery, useSubscribedSignalsQuery } from './services';

export const Signals = () => {
  const { data, isLoading } = useSignalsQuery();
  const subscribedSignals = useSubscribedSignalsQuery();

  return (
    <>
      <WidgetWrapper
        scroll
        poweredBy="wisdomise"
        id="signals-widget-wrapper"
        iconSrc={LastPositionsIconSrc}
        title="Recent Market Predictions"
      >
        {isLoading ? (
          <div className="relative -mx-8 h-[300px] w-[450px]">
            <LoadingIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        ) : (
          <div className="-mx-8 min-w-[450px] max-md:-mx-3 max-md:min-w-full">
            <VirtualWallet />
            <section className="flex flex-col gap-1">
              {data?.last_positions.map(position => {
                const pair = data.pairs.find(
                  p => p.name === position.pair_name,
                );
                const strategy = data.strategies.find(
                  s => s.name === position.strategy_name,
                );
                const firstPrice = pair?.time_window_prices.at(0);
                const lastPrice = pair?.time_window_prices.at(-1);
                if (!pair || !strategy) return null;

                return (
                  <section
                    key={position.strategy_name + pair.name}
                    // eslint-disable-next-line tailwindcss/no-custom-classname
                    className="signal-item flex gap-8 overflow-y-auto bg-black/20 px-6 py-4 max-md:gap-4 max-md:px-2"
                  >
                    <section className="flex flex-col items-start justify-between gap-3">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex w-full items-center">
                          <CoinsIcons coins={[pair.base_name]} />
                          <div className="ml-2">
                            <p className="text-sm text-white ">{pair.title}</p>
                            <p className="text-[10px] text-white/40 ">
                              {pair.base_name} / {pair.quote_name}
                            </p>
                          </div>
                        </div>
                        <Notification
                          pairName={pair.name}
                          strategyName={strategy.name}
                          level={strategy.profile.subscription_level}
                          subscribedKey={
                            subscribedSignals.data?.find(
                              item =>
                                item.pair_name === pair.name &&
                                strategy.name === item.strategy_name,
                            )?.key
                          }
                        />
                      </div>

                      <div className="rounded-lg bg-white/10 p-2">
                        <p className="mb-3 text-xs text-white/40 max-sm:mb-1">
                          Coin market status
                        </p>
                        <div className="flex items-center gap-3 max-sm:gap-1">
                          <p className="text-xs text-white/50">24h</p>
                          <div className="w-[90px] max-sm:w-12">
                            <PriceAreaChart
                              data={pair.time_window_prices.map((d, i) => ({
                                x: i,
                                y: d,
                              }))}
                            />
                          </div>
                          <PriceChange
                            valueToFixed
                            value={
                              firstPrice && lastPrice
                                ? ((lastPrice - firstPrice) / firstPrice) * 100
                                : 0
                            }
                          />
                        </div>
                      </div>
                    </section>
                    <section className="grow">
                      <SignalBox position={position} strategy={strategy} />
                    </section>
                  </section>
                );
              })}
            </section>
          </div>
        )}
      </WidgetWrapper>
    </>
  );
};
