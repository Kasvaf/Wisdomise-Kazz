import { Spin } from 'antd';
import { clsx } from 'clsx';
import { type FC, memo, Suspense, useMemo } from 'react';
import type { SymbolSocailAddresses } from 'services/grpc/proto/network_radar';
import type { CoinCommunityData } from 'services/rest/discovery';
import { HoverTooltip } from 'shared/HoverTooltip';
import { ReactComponent as XCommunityIcon } from 'shared/v1-components/X/assets/community.svg';
import { ReactComponent as XProfileIcon } from 'shared/v1-components/X/assets/profile.svg';
import { ReactComponent as XPostIcon } from 'shared/v1-components/X/assets/tweet.svg';
import { ReactComponent as XIcon } from 'shared/v1-components/X/assets/x.svg';
import { getXSearchUrl } from 'shared/v1-components/X/utils';
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
            rootClassName="[&_.ant-tooltip-inner]:!p-0 !border-transparent [&_.ant-tooltip-inner]:overflow-auto [&_.ant-tooltip-inner]:max-h-96"
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
                window.open(social.url.href, '_blank');
              }}
            >
              {social && <SocialIcon social={social} />}
            </button>
          </HoverTooltip>
        ))}
        {!hideSearch && (
          <HoverTooltip title="Search on X">
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                window.open(
                  getXSearchUrl(
                    `(${[
                      abbreviation && `$${abbreviation}`,
                      name && !name.includes(' ') && `${name}`,
                      contractAddress,
                    ]
                      .filter(x => !!x)
                      .join(' OR ')})&src=typed_query&f=live`,
                  ),
                  '_blank',
                );
              }}
            >
              <XSearchIcon className="size-4" />
            </button>
          </HoverTooltip>
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
    return <XIcon className="size-[15px]" />;
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
