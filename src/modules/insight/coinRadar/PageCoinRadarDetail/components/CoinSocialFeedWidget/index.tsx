import { clsx } from 'clsx';
import {
  type FC,
  Fragment,
  type ReactNode,
  type SVGProps,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { bxRefresh } from 'boxicons-quasar';
import {
  type SocialMessage as SocialMessageType,
  useHasFlag,
  useSocialMessages,
} from 'api';
import { ButtonSelect } from 'shared/ButtonSelect';
import Button from 'shared/Button';
import Icon from 'shared/Icon';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ProLocker } from 'shared/ProLocker';
import { ReactComponent as TelegramIcon } from './images/telegram.svg';
import { ReactComponent as RedditIcon } from './images/reddit.svg';
import { ReactComponent as TwitterIcon } from './images/twitter.svg';
import { ReactComponent as TradingViewIcon } from './images/trading_view.svg';
import { SocialMessage } from './SocialMessage';

function SocialTabTitle({
  isActive,
  label,
  icon: Icon,
}: {
  isActive?: boolean;
  label: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
}) {
  return (
    <h2
      className={clsx(
        'flex items-center gap-2 px-3',
        isActive ? 'text-white' : 'opacity-60 grayscale',
      )}
    >
      {Icon && <Icon className="size-4" />}
      {label}
    </h2>
  );
}

export function CoinSocialFeedWidget({
  id,
  slug,
  socials,
  pageSize,
  title,
  subtitle,
}: {
  id?: string;
  slug: string;
  socials: Array<SocialMessageType['social_type']>;
  pageSize: number;
  title?: string;
  subtitle?: string;
}) {
  const messages = useSocialMessages(slug);
  const { t } = useTranslation('coin-radar');
  const hasFlag = useHasFlag();

  const [activeSocial, setActiveSocial] = useState<
    null | SocialMessageType['social_type']
  >(socials.length > 1 ? null : socials[0]);

  const tabs = useMemo(() => {
    const list: Array<{
      label: ReactNode;
      value: SocialMessageType['social_type'] | null;
      messages?: SocialMessageType[];
    }> = [
      {
        label: (
          <SocialTabTitle
            label={t('coin-details.tabs.socials.types.all.title')}
            isActive={activeSocial === null}
          />
        ),
        value: null,
        messages: messages.data,
      },
      {
        label: (
          <SocialTabTitle
            label={t('coin-details.tabs.socials.types.telegram.title')}
            isActive={activeSocial === 'telegram'}
            icon={TelegramIcon}
          />
        ),
        value: 'telegram',
        messages: messages.data?.filter(row => row.social_type === 'telegram'),
      },
      {
        label: (
          <SocialTabTitle
            label={t('coin-details.tabs.socials.types.reddit.title')}
            isActive={activeSocial === 'reddit'}
            icon={RedditIcon}
          />
        ),
        value: 'reddit',
        messages: messages.data?.filter(row => row.social_type === 'reddit'),
      },
      {
        label: (
          <SocialTabTitle
            label={t('coin-details.tabs.socials.types.twitter.title')}
            isActive={activeSocial === 'twitter'}
            icon={TwitterIcon}
          />
        ),
        value: 'twitter',
        messages: messages.data?.filter(row => row.social_type === 'twitter'),
      },
      {
        label: (
          <SocialTabTitle
            label={t('coin-details.tabs.socials.types.trading_view.title')}
            isActive={activeSocial === 'trading_view'}
            icon={TradingViewIcon}
          />
        ),
        value: 'trading_view',
        messages: messages.data?.filter(
          row => row.social_type === 'trading_view',
        ),
      },
    ];
    return list.filter(x => {
      if (x.value === null) {
        return socials.length > 1;
      }
      return (
        hasFlag(`/coin/[slug]?tab=${x.value}`) &&
        socials.includes(x.value) &&
        (x.messages ?? []).length > 0
      );
    });
  }, [t, activeSocial, messages.data, hasFlag, socials]);

  const activeTab = useMemo(
    () => tabs.find(tab => tab.value === activeSocial),
    [activeSocial, tabs],
  );

  const [limit, setLimit] = useState(pageSize);

  useEffect(() => {
    setLimit(pageSize);
  }, [activeTab?.value, pageSize]);

  return (
    <ProLocker
      level={1}
      mode="children"
      className="overflow-hidden rounded-2xl"
    >
      <OverviewWidget
        id={id}
        title={title ?? t('coin-details.tabs.socials.title')}
        subtitle={subtitle ?? t('coin-details.tabs.socials.subtitle')}
        loading={messages.isLoading}
        className="min-h-[480px]"
        empty={(activeTab?.messages?.length ?? 0) === 0}
        headerClassName="flex-wrap"
        badge="pro"
        headerActions={
          <div className="w-full grow overflow-auto">
            {tabs.length > 1 && (
              <ButtonSelect
                options={tabs}
                value={activeSocial}
                onChange={setActiveSocial}
              />
            )}
          </div>
        }
      >
        <div className="mt-4 flex flex-col gap-4">
          {activeTab?.messages?.slice(0, limit)?.map((message, idx, self) => (
            <Fragment key={message.id}>
              <SocialMessage message={message} className="mb-6" />
              {idx !== self.length - 1 && (
                <div className="h-px bg-v1-border-tertiary" />
              )}
            </Fragment>
          ))}
        </div>
        {limit < (activeTab?.messages?.length ?? 0) && (
          <div className="mt-4 flex items-center justify-center">
            <Button variant="link" onClick={() => setLimit(p => p + pageSize)}>
              {t('coin-details.tabs.socials.load_more')}
              <Icon name={bxRefresh} className="ms-1" />
            </Button>
          </div>
        )}
      </OverviewWidget>
    </ProLocker>
  );
}
