import { useMemo } from 'react';
import type { SocialMessage } from 'services/rest/discovery';
import { ReactComponent as RedditIcon } from './reddit.svg';
import { ReactComponent as TelegramIcon } from './telegram.svg';
import { ReactComponent as TradingViewIcon } from './trading_view.svg';
import { ReactComponent as TwitterIcon } from './twitter.svg';

export function SocialLogo({
  type,
  className,
}: {
  type: SocialMessage['social_type'];
  className?: string;
}) {
  const Logo = useMemo(() => {
    switch (type) {
      case 'reddit': {
        return RedditIcon;
      }
      case 'telegram': {
        return TelegramIcon;
      }
      case 'twitter': {
        return TwitterIcon;
      }
      case 'trading_view': {
        return TradingViewIcon;
      }
    }
  }, [type]);
  if (!Logo) return null;
  return <Logo className={className} />;
}
