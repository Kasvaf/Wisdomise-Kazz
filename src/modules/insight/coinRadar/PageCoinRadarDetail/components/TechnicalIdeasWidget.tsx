import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { useTranslation } from 'react-i18next';
import { Fragment, useMemo, useState } from 'react';
import { bxChevronDown, bxLinkExternal } from 'boxicons-quasar';
import { useCoinOverview, useSocialMessages } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import Icon from 'shared/Icon';
import useIsMobile from 'utils/useIsMobile';
import { SocialMessageSummary } from './CoinSocialFeedWidget/SocialMessage';

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

  const hasChart =
    coinOverview.data?.charts_id?.trading_view_chart_id ||
    coinOverview.data?.charts_id?.gecko_terminal_chart_id;

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
        enabled: tradingViewMessages.length === 0 && !hasChart,
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
          {hasChart && (
            <a
              href={
                coinOverview.data?.charts_id?.trading_view_chart_id
                  ? `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(
                      coinOverview.data.charts_id.trading_view_chart_id,
                    )}`
                  : coinOverview.data?.charts_id?.gecko_terminal_chart_id
                  ? `https://www.geckoterminal.com/${coinOverview.data.charts_id.gecko_terminal_chart_id}`
                  : ''
              }
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
      {hasChart && (
        <div className="h-[500px] overflow-hidden rounded-xl bg-v1-surface-l3 p-2 mobile:h-[350px]">
          {coinOverview.data?.charts_id?.trading_view_chart_id ? (
            <AdvancedRealTimeChart
              allow_symbol_change={false}
              symbol={coinOverview.data.charts_id.trading_view_chart_id}
              style="1"
              interval="60"
              hide_side_toolbar
              hotlist={false}
              theme="dark"
              height={isMobile ? 340 : 490}
              width="100%"
            />
          ) : coinOverview.data?.charts_id?.gecko_terminal_chart_id ? (
            <iframe
              height="100%"
              width="100%"
              id="geckoterminal-embed"
              title="GeckoTerminal Embed"
              src={`https://www.geckoterminal.com/${coinOverview.data.charts_id.gecko_terminal_chart_id}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0`}
              frameBorder="0"
              allow="clipboard-write"
              allowFullScreen
            />
          ) : null}
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
            <button
              className="mt-4 flex w-full items-center justify-center gap-2 text-sm"
              onClick={() => setLimit(p => p + 2)}
            >
              {t('coin-details.tabs.trading_view.load_more')}
              <Icon
                name={bxChevronDown}
                className="text-v1-content-link"
                size={16}
              />
            </button>
          )}
        </div>
      )}
    </OverviewWidget>
  );
}
