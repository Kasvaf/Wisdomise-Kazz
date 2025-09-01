import type { CoinCommunityData } from 'api/discovery';
import type { SymbolSocailAddresses } from 'api/proto/network_radar';
import { clsx } from 'clsx';
import { type FC, useMemo } from 'react';
import { HoverTooltip } from 'shared/HoverTooltip';
import { getLogo, resolveSocials } from './lib';
import { SocialPreview } from './SocialPreview';
import { ReactComponent as XPostIcon } from './x_post.svg';

export const CoinSocials: FC<{
  abbreviation?: string | null;
  name?: string | null;
  contractAddress?: string | null;
  value?: CoinCommunityData['links'] | SymbolSocailAddresses | null;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
  hideSearch?: boolean;
}> = ({
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
          dialogClassName="!pointer-events-auto"
          key={social.url.href}
          placement="bottom"
          title={<SocialPreview social={social} />}
        >
          <span
            className={clsx(
              'shrink-0 rounded-full bg-white/10 text-white/60 text-xxs transition-all hover:text-white/60 active:brightness-90 [&_img]:size-full',
              size === 'xs' && 'flex size-4 items-center justify-center',
              size === 'sm' && 'flex size-6 items-center justify-center',
              size === 'md' && 'flex size-6 items-center justify-center gap-1',
            )}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              go(social.url.href);
            }}
          >
            <div
              className="relative size-full overflow-hidden rounded-full"
              style={{
                backgroundColor: social.type === 'x' ? 'black' : 'white',
              }}
            >
              {social.type === 'x' && social.url.href.includes('/status/') ? (
                <XPostIcon
                  className="size-full scale-75 rounded-full fill-white/90"
                  height="14"
                  width="14"
                />
              ) : (
                <img
                  className="size-full rounded-full p-px contrast-125"
                  height="14"
                  src={getLogo(social.type)}
                  width="14"
                />
              )}
            </div>
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
          <b>X</b>
          {'Search'}
        </span>
      )}
    </div>
  );
};
