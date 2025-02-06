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
import { useCoinDetails } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import Icon from 'shared/Icon';

function LinkBadge({
  icon,
  label,
  href,
}: {
  icon: string;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex h-6 items-center gap-1 rounded-full bg-v1-surface-l3 px-2 text-xs text-v1-content-primary transition-all hover:brightness-110 active:brightness-90"
      target="_blank"
      rel="noreferrer"
    >
      <Icon name={icon} size={16} />
      {label}
    </a>
  );
}

export function CoinLinksWidget({ id, slug }: { slug: string; id?: string }) {
  const { t } = useTranslation('coin-radar');
  const coinOverview = useCoinDetails({ slug });
  const communityData = coinOverview.data?.community_data;
  if (!communityData) return null;

  return (
    <OverviewWidget
      loading={coinOverview.isInitialLoading}
      id={id}
      contentClassName="space-y-8"
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
        <div className="flex flex-wrap items-center gap-2">
          {communityData.links?.subreddit_url && (
            <LinkBadge
              icon={bxlReddit}
              label={t('coin-details.tabs.coin_links.reddit')}
              href={communityData.links?.subreddit_url}
            />
          )}
          {communityData.links?.twitter_screen_name && (
            <LinkBadge
              icon={bxlTwitter}
              label={t('coin-details.tabs.coin_links.twitter')}
              href={`https://x.com/${communityData.links?.twitter_screen_name}`}
            />
          )}
          {communityData.links?.facebook_username && (
            <LinkBadge
              icon={bxlFacebook}
              label={t('coin-details.tabs.coin_links.facebook')}
              href={`https://facebook.com/${communityData.links?.facebook_username}`}
            />
          )}
          {communityData.links?.telegram_channel_identifier && (
            <LinkBadge
              icon={bxlTelegram}
              label={t('coin-details.tabs.coin_links.telegram')}
              href={`https://t.me/${communityData.links?.telegram_channel_identifier}`}
            />
          )}
        </div>
      </div>
    </OverviewWidget>
  );
}
