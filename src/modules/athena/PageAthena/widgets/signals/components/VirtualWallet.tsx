import PriceChange from 'modules/shared/PriceChange';
import { ReactComponent as WalletIcon } from '../icons/wallet.svg';
import { useFPBacktestQuery } from '../services';
import { PriceAreaChart } from './PriceAreaChart';

export const VirtualWallet = () => {
  const backtest = useFPBacktestQuery();

  if (!backtest.data) return null;

  return (
    <div className="mb-1 bg-black/20 px-6 py-4 max-sm:px-2">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <WalletIcon />
          <div className="text-xs">
            <p className="text-white">Athena virtual Wallet</p>
            <p className="mt-3 text-white/50">
              Invested using Athena Signals & Positions
            </p>
          </div>
        </div>

        <div className="text-right max-sm:basis-2/4">
          <p className="text-xxs text-white/40">Wallet Balance Start</p>
          <p className="mt-3 text-sm tracking-wider text-white max-sm:text-xs">
            10,000.00 USDT
          </p>
        </div>
      </div>
      <div className="mt-5 flex w-full items-center justify-between rounded-lg bg-white/5 p-3 max-sm:p-2">
        <div>
          <p className="text-xs text-white/40">Wallet Balance Now</p>
          <div className="mt-2 flex items-center gap-3">
            <p className="text-sm tracking-widest text-white max-sm:text-xs">
              {(
                ((backtest.data?.at(-1)?.value ?? 10) / 100) * 10_000 +
                10_000
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}{' '}
              USDT
            </p>
            <PriceChange value={backtest.data?.at(-1)?.value ?? 10} />

            <p className="text-xxs text-white/50">Start, Apr 1</p>
          </div>
        </div>
        <div className="w-[130px] max-sm:w-[80px]">
          <PriceAreaChart
            height={40}
            data={backtest.data?.map(i => ({ x: i.date, y: i.value }))}
          />
        </div>
      </div>
    </div>
  );
};
