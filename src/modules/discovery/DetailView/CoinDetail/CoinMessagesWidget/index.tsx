import { clsx } from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSocialRadarMessages } from 'services/rest/discovery';
import { Button } from 'shared/v1-components/Button';
import { Table } from 'shared/v1-components/Table';
import { useUnifiedCoinDetails } from '../lib';
import { SocialMessageSummary } from './SocialMessage';

export function CoinMessagesWidget({
  id,
  className,
  type,
  title,
  limit = true,
  hr,
}: {
  id?: string;
  className?: string;
  title?: boolean;
  limit?: boolean;
  type: 'technical_ideas' | 'rest';
  hr?: boolean;
}) {
  const { symbol } = useUnifiedCoinDetails();
  const messages = useSocialRadarMessages({ slug: symbol.slug });
  const { t } = useTranslation('coin-radar');

  const [expand, setExpand] = useState(!limit);

  const msgs = messages.data?.filter(x =>
    type === 'technical_ideas'
      ? x.social_type === 'trading_view'
      : x.social_type !== 'trading_view',
  );

  return (
    <>
      <div
        className={clsx(
          'relative flex flex-col gap-3 overflow-auto overflow-x-hidden',
          className,
        )}
        id={id}
      >
        {title !== false && (
          <h3 className="font-semibold text-sm">
            {type === 'technical_ideas'
              ? t('coin-details.tabs.trading_view.title')
              : t('coin-details.tabs.socials.title')}
          </h3>
        )}
        {messages.isLoading || msgs?.length === 0 ? (
          <Table
            columns={[]}
            dataSource={msgs}
            loading={messages.isLoading}
            scrollable
            surface={1}
          />
        ) : (
          <>
            {msgs?.slice(0, expand ? undefined : 3).map(msg => (
              <SocialMessageSummary key={msg.id} message={msg} />
            ))}
            {(msgs?.length ?? 0) > 3 && !expand && (
              <Button
                onClick={() => setExpand(true)}
                size="xs"
                surface={1}
                variant="link"
              >
                {`Load ${(msgs?.length ?? 0) - 3} More Messages`}
              </Button>
            )}
          </>
        )}
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
