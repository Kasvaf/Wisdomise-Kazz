import { useSPO } from './SPOProvider';

export const CoinsTable = () => {
  const { coins } = useSPO();
  return (
    <>
      {coins.map(coin => (
        <div
          key={coin.asset}
          className="group flex items-center justify-between rounded-lg p-2 transition-colors first:mt-0 hover:bg-white/10"
        >
          <section className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: coin.color }}
            />
            <span className="text-xs font-light leading-none">
              {coin.asset}
            </span>
          </section>
          <section className="flex items-center gap-4 text-xs font-bold">
            <section className="relative">
              <div className="w-[61px] rounded border border-white/10 bg-transparent px-2 py-1  leading-none outline-none [&::-webkit-inner-spin-button]:appearance-none">
                {coin.weight}
              </div>
              <span className="absolute right-2 top-[2px]">%</span>
            </section>
          </section>
        </div>
      ))}
    </>
  );
};
