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

  const [activeTab, setActiveTab] = useState<
    null | SocialMessageType['social_type']
  >(socials.length > 1 ? null : socials[0]);

  const tabs = useMemo(() => {
    const list: Array<{
      label: ReactNode;
      value: SocialMessageType['social_type'] | null;
    }> = [
      {
        label: (
          <SocialTabTitle
            label={t('coin-details.tabs.socials.types.all.title')}
            isActive={activeTab === null}
          />
        ),
        value: null,
      },
      {
        label: (
          <SocialTabTitle
            label={t('coin-details.tabs.socials.types.telegram.title')}
            isActive={activeTab === 'telegram'}
            icon={TelegramIcon}
          />
        ),
        value: 'telegram',
      },
      {
        label: (
          <SocialTabTitle
            label={t('coin-details.tabs.socials.types.reddit.title')}
            isActive={activeTab === 'reddit'}
            icon={RedditIcon}
          />
        ),
        value: 'reddit',
      },
      {
        label: (
          <SocialTabTitle
            label={t('coin-details.tabs.socials.types.twitter.title')}
            isActive={activeTab === 'twitter'}
            icon={TwitterIcon}
          />
        ),
        value: 'twitter',
      },
      {
        label: (
          <SocialTabTitle
            label={t('coin-details.tabs.socials.types.trading_view.title')}
            isActive={activeTab === 'trading_view'}
            icon={TradingViewIcon}
          />
        ),
        value: 'trading_view',
      },
    ];
    return list.filter(x => {
      if (x.value === null) {
        return socials.length > 1;
      }
      return (
        hasFlag(`/insight/coin-radar/[slug]?tab=${x.value}`) &&
        socials.includes(x.value)
      );
    });
  }, [t, activeTab, hasFlag, socials]);

  const activeTabMessages = useMemo(
    () =>
      messages.data?.filter(
        message =>
          socials.includes(message.social_type) &&
          (activeTab === null || message.social_type === activeTab) &&
          hasFlag(`/insight/coin-radar/[slug]?tab=${message.social_type}`),
      ),
    [activeTab, hasFlag, messages.data, socials],
  );

  const [limit, setLimit] = useState(pageSize);

  useEffect(() => {
    setLimit(pageSize);
  }, [activeTab, pageSize]);

  return (
    <OverviewWidget
      id={id}
      title={title ?? t('coin-details.tabs.socials.title')}
      subtitle={subtitle ?? t('coin-details.tabs.socials.subtitle')}
      loading={messages.isLoading}
      contentClassName="min-h-[450px]"
      empty={activeTabMessages?.length === 0}
    >
      <div className="max-w-full overflow-auto">
        {tabs.length > 1 && (
          <ButtonSelect
            options={tabs}
            value={activeTab}
            onChange={setActiveTab}
          />
        )}
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {activeTabMessages?.slice(0, limit)?.map((message, idx, self) => (
          <Fragment key={message.id}>
            <SocialMessage message={message} className="mb-6" />
            {idx !== self.length - 1 && (
              <div className="h-px bg-v1-border-tertiary" />
            )}
          </Fragment>
        ))}
      </div>
      {limit < (activeTabMessages?.length ?? 0) && (
        <div className="mt-4 flex items-center justify-center">
          <Button variant="link" onClick={() => setLimit(p => p + pageSize)}>
            {t('coin-details.tabs.socials.load_more')}
            <Icon name={bxRefresh} className="ms-1" />
          </Button>
        </div>
      )}
    </OverviewWidget>
  );
}
