import { Spin } from 'antd';
import type { CoinCommunityData } from 'api/discovery';
import type { SymbolSocailAddresses } from 'api/proto/network_radar';
import { clsx } from 'clsx';
import { type FC, memo, Suspense, useMemo } from 'react';
import { HoverTooltip } from 'shared/HoverTooltip';
import { ReactComponent as XCommunityIcon } from '../v1-components/X/XCommunityEmbed/x-community.svg';
import { ReactComponent as XPostIcon } from '../v1-components/X/XPostEmbed/x-post.svg';
import { ReactComponent as XProfileIcon } from '../v1-components/X/XProfileEmbed/x-profile.svg';
import { ReactComponent as XIcon } from '../v1-components/X/x.svg';
import { getLogo, resolveSocials, type Social } from './lib';
import { parseXUrl, SocialPreview } from './SocialPreview';
import { ReactComponent as XSearchIcon } from './x-search.svg';

export const TokenSocials: FC<{
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
          'flex items-start justify-start gap-2',
          size === 'xs' ? 'flex-nowrap overflow-hidden text-2xs' : 'flex-wrap',
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
            <button
              className={clsx(
                'shrink-0',
                size === 'xs' && 'flex items-center justify-center',
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
            </button>
          </HoverTooltip>
        ))}
        {!hideSearch && (
          <button
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
            <XSearchIcon className="size-4" />
          </button>
        )}
      </div>
    );
  },
);

const SocialIcon = ({ social }: { social: Social }) => {
  if (social.type === 'x') {
    const res = parseXUrl(social.url.href);
    if (res.type === 'post') return <XPostIcon className="size-3.5" />;
    if (res.type === 'profile' && res.username)
      return <XProfileIcon className="size-4" />;
    if (res.type === 'community' && res.communityId)
      return <XCommunityIcon className="size-4" />;
    return <XIcon className="size-4" />;
  } else {
    return (
      <img
        alt=""
        className="size-4 shrink-0 rounded-full"
        src={getLogo(social.type)}
      />
    );
  }
};
