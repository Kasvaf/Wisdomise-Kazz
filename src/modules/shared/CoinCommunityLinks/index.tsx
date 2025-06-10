import { clsx } from 'clsx';
import { type FC } from 'react';
import { Tooltip } from 'antd';
import { type Coin } from 'api/types/shared';
import { type CoinCommunityData } from 'api/discovery';
import { useCoinCommunityLinks } from './useCoinCommunityLinks';
import { ReactComponent as TwitterIcon } from './x.svg';

export const CoinCommunityLinks: FC<{
  coin?: Coin;
  contractAddresses?: string[] | null;
  value?: CoinCommunityData['links'] | null;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
  includeTwitterSearch?: boolean;
}> = ({
  value,
  className,
  size = 'sm',
  includeTwitterSearch,
  coin,
  contractAddresses,
}) => {
  const socials = useCoinCommunityLinks(value).filter(x => x.type === 'social');

  return (
    <div
      className={clsx(
        'flex items-start justify-start gap-1',
        size === 'xs' ? 'flex-nowrap overflow-hidden text-xxs' : 'flex-wrap',
        className,
      )}
    >
      {/* Socials */}
      {socials?.map(social => (
        <Tooltip
          open={social.preview ? undefined : false}
          key={social.href}
          title={social.preview}
          rootClassName="!max-w-[400px] [&_.ant-tooltip-inner]:rounded-xl [&_.ant-tooltip-inner]:!bg-transparent [&_.ant-tooltip-arrow]:hidden"
          placement="bottom"
        >
          <a
            key={social.href}
            href={social.href}
            className={clsx(
              'shrink-0 rounded-full bg-white/10 text-xxs text-white/60 transition-all hover:text-white/60 hover:brightness-110 active:brightness-90',
              size === 'xs' &&
                'flex size-[18px] items-center justify-center [&_svg]:size-[10px]',
              size === 'sm' &&
                'flex size-6 items-center justify-center [&_img]:size-[12px] [&_svg]:size-[12px]',
              size === 'md' &&
                'flex h-6 items-center justify-center gap-1 px-3 [&_img]:size-[12px] [&_svg]:!size-[12px]',
            )}
            target="_blank"
            rel="noreferrer"
          >
            {social.icon} {size === 'md' ? social.label : ''}
          </a>
        </Tooltip>
      ))}
      {includeTwitterSearch && coin && (
        <a
          href={`https://x.com/search?q=(${[
            coin?.abbreviation && `$${coin.abbreviation}`,
            coin?.name && !coin.name.includes(' ') && `${coin.name}`,
            ...(contractAddresses || []).filter(x => !!x),
          ].join('%20OR%20')})&src=typed_query&f=live`}
          className={clsx(
            'inline-flex items-center gap-1 rounded-full bg-white/10 px-2 text-xs text-white/60 transition-all hover:brightness-110 active:brightness-90',
            'h-[18px] shrink-0 justify-center',
            '[&_svg]:size-[10px]',
          )}
          target="_blank"
          rel="noreferrer"
        >
          <TwitterIcon />
          {'Search'}
        </a>
      )}
    </div>
  );
};
