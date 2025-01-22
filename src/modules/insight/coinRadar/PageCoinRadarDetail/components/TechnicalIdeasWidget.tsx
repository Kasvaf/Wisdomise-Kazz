import { useTranslation } from 'react-i18next';
import { Fragment, useMemo, useState } from 'react';
import { bxChevronDown, bxLinkExternal } from 'boxicons-quasar';
import { useCoinOverview, useSocialMessages } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import Icon from 'shared/Icon';
import useIsMobile from 'utils/useIsMobile';
import { Button } from 'shared/v1-components/Button';
import { SocialMessageSummary } from './CoinSocialFeedWidget/SocialMessage';
import CoinChart from './CoinChart';

export function TechnicalIdeasWidget({
  slug,
  id,
}: {
  slug: string;
  id?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const coinOverview = useCoinOverview({ slug });
  const messages = useSocialMessages(slug);
  const isMobile = useIsMobile();
  const [limit, setLimit] = useState(3);

  const chartUrl = coinOverview.data?.charts_id?.gecko_terminal_chart_id
    ? `https://www.geckoterminal.com/${coinOverview.data.charts_id.gecko_terminal_chart_id}`
    : coinOverview.data?.charts_id?.trading_view_chart_id
    ? `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(
        coinOverview.data?.charts_id.trading_view_chart_id,
      )}`
    : null;

  const tradingViewMessages = useMemo(() => {
    return (messages.data ?? [])
      .filter(x => x.social_type === 'trading_view')
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [messages]);

  return (
    <OverviewWidget
      title={t('coin-details.tabs.trading_view.title')}
      contentClassName="space-y-4"
      id={id}
      loading={messages.isLoading || coinOverview.isLoading}
      empty={{
        enabled: tradingViewMessages.length === 0 && !chartUrl,
        refreshButton: true,
        title: t('coin-details.tabs.trading_view.empty.title'),
        subtitle: t('coin-details.tabs.trading_view.empty.subtitle'),
      }}
      refreshing={messages.isRefetching || coinOverview.isRefetching}
      onRefresh={() => {
        void messages.refetch();
        void coinOverview.refetch();
      }}
      headerActions={
        <>
          {chartUrl && (
            <a
              href={chartUrl}
              target="_blank"
              className="inline-flex items-center justify-center hover:brightness-110 active:brightness-90 mobile:p-1"
              rel="noreferrer"
            >
              <Icon
                name={bxLinkExternal}
                className="text-v1-content-primary"
                size={19}
              />
            </a>
          )}
        </>
      }
    >
      {chartUrl && (
        <div className="h-[580px] overflow-hidden rounded-xl bg-v1-surface-l3 p-2 mobile:h-[400px]">
          <CoinChart slug={slug} height={isMobile ? 400 : 580} />
        </div>
      )}

      {tradingViewMessages.length > 0 && (
        <div className="space-y-4 overflow-x-auto rounded-xl bg-v1-surface-l3 p-6 mobile:bg-transparent mobile:p-0">
          {tradingViewMessages.slice(0, limit).map((msg, idx, self) => (
            <Fragment key={msg.id}>
              <SocialMessageSummary
                message={msg}
                className="bg-v1-surface-l3 mobile:bg-v1-surface-l2"
              />
              {(idx < self.length - 1 ||
                limit < tradingViewMessages.length) && (
                <div className="h-px bg-v1-border-tertiary" />
              )}
            </Fragment>
          ))}
          {limit < tradingViewMessages.length && (
            <Button
              className="mx-auto mt-4"
              size="md"
              block
              variant="ghost"
              onClick={() => setLimit(p => p + 2)}
            >
              {t('common.load_more')}
              <Icon
                name={bxChevronDown}
                className="text-v1-content-link"
                size={16}
              />
            </Button>
          )}
        </div>
      )}
    </OverviewWidget>
  );
}
