import { useTranslation } from 'react-i18next';
import {
  bxDetail,
  bxGlobe,
  bxlFacebook,
  bxlGithub,
  bxlReddit,
  bxlTelegram,
  bxlTwitter,
  bxPackage,
} from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useCoinDetails } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import Icon from 'shared/Icon';
import useIsMobile from 'utils/useIsMobile';
import { type CoinDetails } from 'api/types/shared';

function LinkBadge({
  icon,
  label,
  href,
}: {
  icon: string;
  label?: string | null;
  href: string;
}) {
  return (
    <a
      href={href}
      className={clsx(
        'inline-flex items-center gap-1 rounded-full text-xs text-v1-content-primary transition-all bg-v1-surface-l-next hover:brightness-110 active:brightness-90',
        label ? 'h-6 justify-between px-2' : 'size-5 shrink-0 justify-center',
      )}
      target="_blank"
      rel="noreferrer"
    >
      <Icon name={icon} size={label ? 16 : 13} />
      {label}
    </a>
  );
}

export function CoinSocials({
  className,
  value,
  iconsOnly,
}: {
  className?: string;
  value: CoinDetails['community_data'];
  iconsOnly: boolean;
}) {
  const { t } = useTranslation('coin-radar');

  return (
    <div className={clsx('flex items-center', className)}>
      {value?.links?.subreddit_url && (
        <LinkBadge
          icon={bxlReddit}
          label={iconsOnly ? '' : t('coin-details.tabs.coin_links.reddit')}
          href={value?.links?.subreddit_url}
        />
      )}
      {value?.links?.twitter_screen_name && (
        <LinkBadge
          icon={bxlTwitter}
          label={iconsOnly ? '' : t('coin-details.tabs.coin_links.twitter')}
          href={`https://x.com/${value.links?.twitter_screen_name}`}
        />
      )}
      {value?.links?.facebook_username && (
        <LinkBadge
          icon={bxlFacebook}
          label={iconsOnly ? '' : t('coin-details.tabs.coin_links.facebook')}
          href={`https://facebook.com/${value.links?.facebook_username}`}
        />
      )}
      {value?.links?.telegram_channel_identifier && (
        <LinkBadge
          icon={bxlTelegram}
          label={iconsOnly ? '' : t('coin-details.tabs.coin_links.telegram')}
          href={`https://t.me/${value.links?.telegram_channel_identifier}`}
        />
      )}
    </div>
  );
}

export function CoinLinksWidget({ id, slug }: { slug: string; id?: string }) {
  const { t } = useTranslation('coin-radar');
  const isMobile = useIsMobile();
  const coinOverview = useCoinDetails({ slug });
  const communityData = coinOverview.data?.community_data;
  if (!communityData) return null;

  return (
    <OverviewWidget
      loading={coinOverview.isInitialLoading}
      id={id}
      contentClassName="space-y-8 mobile:space-y-4"
      surface={isMobile ? 3 : 1}
      className="mobile:p-0"
    >
      <div className="space-y-2">
        <label className="text-xs font-normal text-v1-content-primary">
          {t('coin-details.tabs.coin_links.official_links')}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {(communityData.links?.homepage ?? [])
            .filter(x => !!x)
            .map((value, idx) => (
              <LinkBadge
                icon={bxGlobe}
                label={`${t('coin-details.tabs.coin_links.homepage')} ${
                  idx > 0 ? `#${idx + 1}` : ''
                }`.trim()}
                href={value}
                key={value}
              />
            ))}
          {(communityData.links?.repos_url.github ?? [])
            .filter(x => !!x)
            .map((value, idx) => (
              <LinkBadge
                icon={bxlGithub}
                label={`${t('coin-details.tabs.coin_links.github')} ${
                  idx > 0 ? `#${idx + 1}` : ''
                }`.trim()}
                href={value}
                key={value}
              />
            ))}
          {(communityData.links?.repos_url.bitbucket ?? [])
            .filter(x => !!x)
            .map((value, idx) => (
              <LinkBadge
                icon={bxPackage}
                label={`${t('coin-details.tabs.coin_links.bitbucket')} ${
                  idx > 0 ? `#${idx + 1}` : ''
                }`.trim()}
                href={value}
                key={value}
              />
            ))}
          {communityData.links?.whitepaper && (
            <LinkBadge
              icon={bxDetail}
              label={t('coin-details.tabs.coin_links.whitepaper')}
              href={communityData.links?.whitepaper}
            />
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-normal text-v1-content-primary">
          {t('coin-details.tabs.coin_links.social')}
        </label>
        <CoinSocials
          className="flex-wrap gap-2"
          value={communityData}
          iconsOnly={false}
        />
      </div>
    </OverviewWidget>
  );
}
