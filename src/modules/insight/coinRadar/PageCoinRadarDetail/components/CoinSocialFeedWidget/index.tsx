import { clsx } from 'clsx';
import { Fragment, type ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type SocialMessage as SocialMessageType,
  useHasFlag,
  useSocialMessages,
} from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { AccessShield } from 'shared/AccessShield';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { SocialMessageSummary } from './SocialMessage';
import { SocialLogo } from './SocialLogo';

function SocialTabTitle({
  count,
  label,
  type,
}: {
  count?: number;
  label: string;
  type?: SocialMessageType['social_type'];
}) {
  return (
    <div
      className={clsx('flex items-center gap-2 px-3 text-v1-content-primary')}
    >
      {type && <SocialLogo type={type} className="size-4" />}
      {label}
      {typeof count === 'number' && (
        <span className="text-v1-content-secondary">({count})</span>
      )}
    </div>
  );
}

export function CoinSocialFeedWidget({
  id,
  slug,
}: {
  id?: string;
  slug: string;
}) {
  const messages = useSocialMessages(slug);
  const { t } = useTranslation('coin-radar');
  const hasFlag = useHasFlag();

  const [activeSocial, setActiveSocial] = useState<
    null | SocialMessageType['social_type']
  >(null);

  const tabs = useMemo(() => {
    const messagesMap: Record<
      SocialMessageType['social_type'],
      SocialMessageType[]
    > = {
      telegram: hasFlag('/coin/[slug]?tab=telegram')
        ? messages.data
            ?.filter(row => row.social_type === 'telegram')
            .sort((a, b) => b.timestamp - a.timestamp) ?? []
        : [],
      reddit: hasFlag('/coin/[slug]?tab=reddit')
        ? messages.data
            ?.filter(row => row.social_type === 'reddit')
            .sort((a, b) => b.timestamp - a.timestamp) ?? []
        : [],
      twitter: hasFlag('/coin/[slug]?tab=twitter')
        ? messages.data
            ?.filter(row => row.social_type === 'twitter')
            .sort((a, b) => b.timestamp - a.timestamp) ?? []
        : [],
      trading_view: [],
    };
    let list: Array<{
      label: ReactNode;
      value: SocialMessageType['social_type'] | null;
      messages: SocialMessageType[];
    }> = [
      {
        label: (
          <SocialTabTitle
            label={t('coin-details.tabs.socials.types.telegram.title')}
            type="telegram"
            count={messagesMap.telegram.length}
          />
        ),
        value: 'telegram',
        messages: messagesMap.telegram,
      },
      {
        label: (
          <SocialTabTitle
            label={t('coin-details.tabs.socials.types.reddit.title')}
            type="reddit"
            count={messagesMap.reddit.length}
          />
        ),
        value: 'reddit',
        messages: messagesMap.reddit,
      },
      {
        label: (
          <SocialTabTitle
            label={t('coin-details.tabs.socials.types.twitter.title')}
            type="twitter"
            count={messagesMap.twitter.length}
          />
        ),
        value: 'twitter',
        messages: hasFlag('/coin/[slug]?tab=twitter')
          ? messages.data
              ?.filter(row => row.social_type === 'twitter')
              .sort((a, b) => b.timestamp - a.timestamp) ?? []
          : [],
      },
    ];
    list = [
      {
        label: (
          <SocialTabTitle
            label={t('coin-details.tabs.socials.types.all.title')}
            count={Object.values(messagesMap).reduce((p, c) => p + c.length, 0)}
          />
        ),
        value: null,
        messages: list
          .flatMap(x => x.messages)
          .sort((a, b) => b.timestamp - a.timestamp),
      },
      ...list,
    ];
    return list.filter(x => x.messages.length > 0);
  }, [t, messages.data, hasFlag]);

  const activeTab = useMemo(
    () => tabs.find(tab => tab.value === activeSocial),
    [activeSocial, tabs],
  );

  const [limit, setLimit] = useState(2);

  useEffect(() => {
    setLimit(2);
  }, [activeTab?.value]);

  return (
    <AccessShield
      mode="children"
      className="overflow-hidden rounded-2xl"
      sizes={{
        'guest': true,
        'trial': true,
        'free': true,
        'pro': false,
        'pro+': false,
      }}
    >
      <OverviewWidget
        id={id}
        title={t('coin-details.tabs.socials.title')}
        subtitle={t('coin-details.tabs.socials.subtitle')}
        loading={messages.isLoading}
        empty={{
          enabled: (activeTab?.messages?.length ?? 0) === 0,
          refreshButton: true,
          title: t('coin-details.tabs.socials.empty.title'),
          subtitle: t('coin-details.tabs.socials.empty.subtitle'),
        }}
        refreshing={messages.isRefetching}
        onRefresh={messages.refetch}
        contentClassName="max-h-[550px] mobile:max-h-[400px] overflow-auto"
      >
        <div className="w-full grow overflow-auto">
          {tabs.length > 1 && (
            <ButtonSelect
              options={tabs}
              value={activeSocial}
              onChange={setActiveSocial}
            />
          )}
        </div>
        <div className="mt-4 flex flex-col gap-6">
          {activeTab?.messages?.map((message, idx, self) => (
            <Fragment key={message.id}>
              <SocialMessageSummary message={message} />
              {(idx < self.length - 1 ||
                limit < (activeTab?.messages?.length ?? 0)) && (
                <div className="h-px bg-v1-border-tertiary" />
              )}
            </Fragment>
          ))}
        </div>
      </OverviewWidget>
    </AccessShield>
  );
}
