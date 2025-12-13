import { type FC, lazy } from 'react';
import XCommunityEmbed from 'shared/v1-components/X/XCommunityEmbed';
import XProfileEmbed from 'shared/v1-components/X/XProfileEmbed';
import { XTweetEmbed } from 'shared/v1-components/X/XTweetEmbed';
import type { Social } from './lib';

const FacebookEmbed = lazy(() =>
  import('react-social-media-embed').then(x => ({ default: x.FacebookEmbed })),
);
const _XEmbed = lazy(() =>
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

export function parseXUrl(url: string) {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.split('/').filter(Boolean);

    // /username
    if (parts.length === 1) {
      return {
        type: 'profile',
        username: parts[0],
      };
    }

    // /i/communities/:communityId
    if (
      parts.length === 3 &&
      parts[0] === 'i' &&
      parts[1] === 'communities' &&
      parts[2]
    ) {
      return {
        type: 'community',
        communityId: parts[2],
      };
    }

    // /username/status/:postId
    if (parts.length === 3 && parts[1] === 'status') {
      return {
        type: 'post',
        username: parts[0],
        postId: parts[2],
      };
    }

    return { type: 'unknown' };
  } catch {
    return { type: 'invalid' };
  }
}

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
    const res = parseXUrl(social.url.href);
    if (res.type === 'post' && res.postId)
      return <XTweetEmbed className="!w-72" tweetId={res.postId} />;
    if (res.type === 'profile' && res.username)
      return <XProfileEmbed username={res.username} />;
    if (res.type === 'community' && res.communityId)
      return <XCommunityEmbed communityId={res.communityId} />;
  }
  return (
    <a
      className="mx-3 flex h-8 items-center justify-center text-sm"
      href={social.url.href}
      onClick={e => e.stopPropagation()}
      target="_blank"
    >
      Visit Url
    </a>
  );
};
