import { clsx } from 'clsx';
import { type FC } from 'react';
import { Tooltip } from 'antd';
import { type CoinCommunityData } from 'api/discovery';
import { useCoinCommunityLinks } from './useCoinCommunityLinks';
import { ReactComponent as TwitterIcon } from './x.svg';

export const CoinCommunityLinks: FC<{
  abbreviation?: string | null;
  name?: string | null;
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
  abbreviation,
  name,
  contractAddresses,
}) => {
  const socials = useCoinCommunityLinks(value).filter(x => x.type === 'social');

  const go = (href: string) => window.open(href, '_blank');

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
          <span
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              go(social.href);
            }}
            className={clsx(
              'shrink-0 rounded-full bg-white/10 text-xxs text-white/60 transition-all hover:text-white/60 active:brightness-90',
              size === 'xs' &&
                'flex size-4 items-center justify-center [&_svg]:size-[10px]',
              size === 'sm' &&
                'flex size-6 items-center justify-center [&_img]:size-[12px] [&_svg]:size-[12px]',
              size === 'md' &&
                'flex h-6 items-center justify-center gap-1 px-3 [&_img]:size-[12px] [&_svg]:!size-[12px]',
            )}
          >
            {social.icon} {size === 'md' ? social.label : ''}
          </span>
        </Tooltip>
      ))}
      {includeTwitterSearch && (
        <span
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            go(
              `https://x.com/search?q=(${[
                abbreviation && `$${abbreviation}`,
                name && !name.includes(' ') && `${name}`,
                ...(contractAddresses || []),
              ]
                .filter(x => !!x)
                .join('%20OR%20')})&src=typed_query&f=live`,
            );
          }}
          className={clsx(
            'inline-flex cursor-pointer items-center gap-1 rounded-full bg-white/10 px-1 text-[9px] text-white/60 transition-all hover:bg-white/5 active:brightness-90',
            'h-4 shrink-0 justify-center',
            '[&_svg]:size-[9px]',
          )}
        >
          <TwitterIcon />
          {'Search'}
        </span>
      )}
    </div>
  );
};
