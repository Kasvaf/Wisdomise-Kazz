import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useState } from 'react';
import { useSocialRadarMessages } from 'api/discovery';
import { Button } from 'shared/v1-components/Button';
import { useUnifiedCoinDetails } from '../useUnifiedCoinDetails';
import { SocialMessageSummary } from './SocialMessage';

export function CoinMessagesWidget({
  id,
  slug,
  className,
  type,
  title,
  limit = true,
  hr,
}: {
  id?: string;
  slug: string;
  className?: string;
  title?: boolean;
  limit?: boolean;
  type: 'technical_ideas' | 'rest';
  hr?: boolean;
}) {
  const { rawData } = useUnifiedCoinDetails({ slug });
  const messages = useSocialRadarMessages({ slug });
  const { t } = useTranslation('coin-radar');

  const [expand, setExpand] = useState(!limit);

  const msgs = messages.data?.filter(x =>
    type === 'technical_ideas'
      ? x.social_type === 'trading_view'
      : x.social_type !== 'trading_view',
  );

  if (!msgs?.length || !!rawData.data2) return null;

  return (
    <>
      <div
        id={id}
        className={clsx(
          'relative flex flex-col gap-4 overflow-auto overflow-x-hidden',
          className,
        )}
      >
        {title !== false && (
          <h3 className="text-sm font-semibold">
            {type === 'technical_ideas'
              ? t('coin-details.tabs.trading_view.title')
              : t('coin-details.tabs.socials.title')}
          </h3>
        )}
        {msgs?.slice(0, expand ? undefined : 3).map(msg => (
          <SocialMessageSummary message={msg} key={msg.id} />
        ))}
        {(msgs?.length ?? 0) > 3 && !expand && (
          <Button
            size="xs"
            onClick={() => setExpand(true)}
            variant="link"
            surface={1}
          >
            {`Load ${(msgs?.length ?? 0) - 3} More Messages`}
          </Button>
        )}
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
