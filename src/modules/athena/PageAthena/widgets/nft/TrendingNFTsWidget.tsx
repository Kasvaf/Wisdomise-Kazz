import { clsx } from 'clsx';
import { WidgetWrapper } from '../WidgetWrapper';
import nftIcon from './nft.svg';
import { useTopNFTsQuery } from './useTopNFTsQuery';

export default function TrendingNFTsWidget() {
  const { data, isLoading } = useTopNFTsQuery();
  const theFirstThree = data?.splice(0, 3);

  if (isLoading) {
    return null;
  }

  return (
    <WidgetWrapper
      scroll
      iconSrc={nftIcon}
      title="Trending NFT projects"
      poweredBy="lunarcrush"
    >
      <section className="mt-6 flex justify-between border-b border-solid border-white/10 pb-4">
        {theFirstThree?.map(nft => (
          <div
            key={nft.lunar_id}
            className="flex shrink grow basis-0 flex-col items-center justify-center gap-4 overflow-hidden"
          >
            <img
              className="h-14 w-14 rounded-lg"
              src={nft.logo}
              title={nft.name}
            />
            <p className="w-4/5 truncate text-center">{nft.name}</p>
            <div className="flex items-center gap-2 text-xs max-md:flex-col ">
              <div className="whitespace-nowrap">
                {Number(nft.current_price.toFixed(4))} <span>ETH</span>
              </div>
              <div
                className={clsx(
                  'text-[#00FFA3]',
                  nft.percent_change < 0 && 'text-[#F23645]',
                )}
              >
                {Number(nft.percent_change.toFixed(1))}%
              </div>
            </div>
          </div>
        ))}
      </section>
      {data?.map(nft => (
        <div
          key={nft.lunar_id}
          className="flex items-center gap-x-4 border-b border-solid border-white/10 py-4 text-sm"
        >
          <img className="w-8 rounded-lg" src={nft.logo} title={nft.name} />
          <p className="mr-auto text-base">{nft.name}</p>
          <div className="whitespace-nowrap">
            {Number(nft.current_price.toFixed(4))}{' '}
            <span className="text-sm">ETH</span>
          </div>
          <div
            className={clsx(
              'text-sm text-[#00FFA3]',
              nft.percent_change < 0 && 'text-[#F23645]',
            )}
          >
            {Number(nft.percent_change.toFixed(1))}%
          </div>
        </div>
      ))}
    </WidgetWrapper>
  );
}
