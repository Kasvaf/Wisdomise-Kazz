import { type FC, lazy } from 'react';
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
const PlaceholderEmbed = lazy(() =>
  import('react-social-media-embed').then(x => ({
    default: x.PlaceholderEmbed,
  })),
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
      return (
        <PlaceholderEmbed
          color="black"
          imageUrl={`https://unavatar.io/x/${cleanedPathName}`}
          linkText="View Profile on X"
          spinnerDisabled
          style={{
            width: 250,
            height: 250,
            background: 'black',
          }}
          url={social.url.href}
        />
      );
    }
  }
  return (
    <a className="text-sm" href={social.url.href} target="_blank">
      Visit Url
    </a>
  );
};
