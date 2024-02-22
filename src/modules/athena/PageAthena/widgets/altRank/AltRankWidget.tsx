import { clsx } from 'clsx';
import { WidgetWrapper } from '../WidgetWrapper';
import rankIcon from './rank.svg';
import { useTopCoinsQuery } from './useTopCoinsQuery';

export default function AltRankWidget() {
  const { data, isLoading } = useTopCoinsQuery();
  const theFirstThree = data?.splice(0, 3);

  if (isLoading) {
    return null;
  }

  return (
    <WidgetWrapper
      scroll
      iconSrc={rankIcon}
      title="Trending Alt coins"
      poweredBy="lunarcrush"
    >
      <section className="mt-6 flex justify-between border-b border-solid border-white/10 pb-4">
        {theFirstThree?.map(coin => (
          <div
            key={coin.asset_id}
            className="flex shrink grow basis-0 flex-col items-center justify-center gap-4 overflow-hidden"
          >
            <img
              className="h-14 w-14 rounded-lg"
              src={coin.logo}
              title={coin.name}
            />
            <p className="w-4/5 truncate text-center">{coin.name}</p>
            <div className="flex items-center gap-2 text-xs">
              <div className="whitespace-nowrap">
                {Number(coin.current_price.toFixed(3))} <span>USD</span>
              </div>
              <div
                className={clsx(
                  'text-[#00FFA3]',
                  coin.percent_change < 0 && 'text-[#F23645]',
                )}
              >
                {Number(coin.percent_change.toFixed(1))}%
              </div>
            </div>
          </div>
        ))}
      </section>
      {data?.map(coin => (
        <div
          key={coin.asset_id}
          className="flex items-center gap-x-4 border-b border-solid border-white/10 py-4 text-sm"
        >
          <img className="w-8 rounded-lg" src={coin.logo} title={coin.name} />
          <p className="mr-auto text-base">{coin.name}</p>
          <div className="whitespace-nowrap">
            {Number(coin.current_price.toFixed(3))}{' '}
            <span className="text-sm">USD</span>
          </div>
          <div
            className={clsx(
              'text-sm text-[#00FFA3]',
              coin.percent_change < 0 && 'text-[#F23645]',
            )}
          >
            {Number(coin.percent_change.toFixed(1))}%
          </div>
        </div>
      ))}
    </WidgetWrapper>
  );
}
