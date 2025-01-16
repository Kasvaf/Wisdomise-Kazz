import { clsx } from 'clsx';
import { useMemo } from 'react';
import { type SocialMessage } from 'api';
import { TEMPLE_ORIGIN } from 'config/constants';

export function SocialMessageImage({
  message,
  className,
}: {
  message: SocialMessage;
  className?: string;
}) {
  const thumbnail = useMemo(() => {
    let ret: string | undefined;
    switch (message.social_type) {
      case 'telegram': {
        ret = message.content.photo_url;
        break;
      }
      case 'reddit': {
        ret = message.content.thumbnail;
        break;
      }
      case 'trading_view': {
        ret = message.content.cover_image_link;
        break;
      }
      case 'twitter': {
        ret =
          typeof message.content.media === 'string'
            ? message.content.media
            : message.content.media?.[0]?.url;
      }
    }
    if (ret) {
      ret = /^http(s?):\/\//.test(ret) ? ret : TEMPLE_ORIGIN + ret;
    }
    return ret;
  }, [message]);

  if (!thumbnail) return null;

  return <img src={thumbnail} className={clsx('object-contain', className)} />;
}
