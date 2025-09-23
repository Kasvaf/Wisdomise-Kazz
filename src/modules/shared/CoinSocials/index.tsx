import { Spin } from 'antd';
import type { CoinCommunityData } from 'api/discovery';
import type { SymbolSocailAddresses } from 'api/proto/network_radar';
import { clsx } from 'clsx';
import { type FC, memo, Suspense, useMemo } from 'react';
import { HoverTooltip } from 'shared/HoverTooltip';
import { getLogo, resolveSocials, type Social } from './lib';
import { parseXUrl, SocialPreview } from './SocialPreview';
import { ReactComponent as XIcon } from './x.svg';
import { ReactComponent as XCommunityIcon } from './x-community.svg';
import { ReactComponent as XPostIcon } from './x-post.svg';
import { ReactComponent as XProfileIcon } from './x-profile.svg';

export const CoinSocials: FC<{
  abbreviation?: string | null;
  name?: string | null;
  contractAddress?: string | null;
  value?: CoinCommunityData['links'] | SymbolSocailAddresses | null;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
  hideSearch?: boolean;
}> = memo(
  ({
    value,
    className,
    size = 'sm',
    abbreviation,
    name,
    contractAddress,
    hideSearch,
  }) => {
    const socials = useMemo(() => resolveSocials(value), [value]);

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
          <HoverTooltip
            key={social.url.href}
            placement="bottom"
            rootClassName="[&_.ant-tooltip-inner]:!p-0 [&_.ant-tooltip-inner]:overflow-auto [&_.ant-tooltip-inner]:max-h-96"
            title={
              <Suspense fallback={<Spin />}>
                <SocialPreview social={social} />
              </Suspense>
            }
          >
            <span
              className={clsx(
                'shrink-0 rounded-full bg-white/10 text-white/60 text-xxs transition-all hover:text-white/60 active:brightness-90 [&_img]:size-full',
                size === 'xs' && 'flex size-4 items-center justify-center',
                size === 'sm' && 'flex size-6 items-center justify-center',
                size === 'md' &&
                  'flex size-6 items-center justify-center gap-1',
              )}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                go(social.url.href);
              }}
            >
              {social && <SocialIcon social={social} />}
            </span>
          </HoverTooltip>
        ))}
        {!hideSearch && (
          <span
            className={clsx(
              'inline-flex cursor-pointer items-center gap-1 rounded-full bg-white/10 px-1 text-[9px] text-white/60 transition-all hover:bg-white/5 active:brightness-90',
              'h-4 shrink-0 justify-center',
              '[&_svg]:size-[9px]',
            )}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              go(
                `https://x.com/search?q=(${[
                  abbreviation && `$${abbreviation}`,
                  name && !name.includes(' ') && `${name}`,
                  contractAddress,
                ]
                  .filter(x => !!x)
                  .join('%20OR%20')})&src=typed_query&f=live`,
              );
            }}
          >
            <XIcon />
            {'Search'}
          </span>
        )}
      </div>
    );
  },
);

const SocialIcon = ({ social }: { social: Social }) => {
  if (social.type === 'x') {
    const res = parseXUrl(social.url.href);
    if (res.type === 'post') return <XPostIcon className="size-3" />;
    if (res.type === 'profile' && res.username)
      return <XProfileIcon className="size-4" />;
    if (res.type === 'community' && res.communityId)
      return <XCommunityIcon className="size-4" />;
    return <XIcon className="size-3" />;
  } else {
    return (
      <img
        alt=""
        className="size-full rounded-full p-px contrast-125"
        height="14"
        src={getLogo(social.type)}
        width="14"
      />
    );
  }
};
