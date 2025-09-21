import { type FC, lazy } from 'react';
import XCommunityEmbed from 'shared/CoinSocials/XCommunityEmbed';
import XProfileEmbed from 'shared/CoinSocials/XProfileEmbed';
import type { Social } from './lib';

const FacebookEmbed = lazy(() =>
  import('react-social-media-embed').then(x => ({ default: x.FacebookEmbed })),
);
const XEmbed = lazy(() =>
  import('react-social-media-embed').then(x => ({ default: x.XEmbed })),
);
const InstagramEmbed = lazy(() =>
  import('react-social-media-embed').then(x => ({ default: x.InstagramEmbed })),
);
const TikTokEmbed = lazy(() =>
  import('react-social-media-embed').then(x => ({ default: x.TikTokEmbed })),
);
const YouTubeEmbed = lazy(() =>
  import('react-social-media-embed').then(x => ({ default: x.YouTubeEmbed })),
);

export const SocialPreview: FC<{ social: Social }> = ({ social }) => {
  if (social.type === 'youtube')
    return <YouTubeEmbed height={140} url={social.url.href} width={325} />;
  if (social.type === 'tiktok')
    // TODO: test
    return <TikTokEmbed url={social.url.href} width={325} />;
  if (social.type === 'facebook')
    // TODO: test
    return <FacebookEmbed url={social.url.href} width={325} />;
  if (social.type === 'instagram')
    // TODO: test
    return <InstagramEmbed url={social.url.href} width={325} />;
  if (social.type === 'x') {
    if (social.url.href.includes('/status/'))
      return <XEmbed url={social.url.href} width={325} />;
    const cleanedPathName = social.url.pathname.slice(
      social.url.pathname.startsWith('/') ? 1 : 0,
      social.url.pathname.endsWith('/') ? -1 : undefined,
    );

    if (cleanedPathName && !cleanedPathName.includes('/')) {
      return <XProfileEmbed username={cleanedPathName} />;
    }

    if (cleanedPathName.startsWith('i/communities')) {
      const id = cleanedPathName.split('/').pop() ?? '';
      return <XCommunityEmbed communityId={id} />;
    }
  }
  return (
    <a className="text-sm" href={social.url.href} target="_blank">
      Visit Url
    </a>
  );
};
