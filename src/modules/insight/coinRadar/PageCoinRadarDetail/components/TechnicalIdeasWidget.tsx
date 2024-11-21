import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { useTranslation } from 'react-i18next';
import { Fragment, useMemo, useState } from 'react';
import { bxChevronDown, bxLinkExternal } from 'boxicons-quasar';
import { useCoinOverview, useSocialMessages } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import Icon from 'shared/Icon';
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

  const [limit, setLimit] = useState(2);

  const tradingViewMessages = useMemo(() => {
    return (messages.data ?? []).filter(x => x.social_type === 'trading_view');
  }, [messages]);

  return (
    <OverviewWidget
      title={t('coin-details.tabs.trading_view.title')}
      contentClassName="min-h-[130px] mobile:min-h-[250px] space-y-4"
      id={id}
      loading={
        messages.isLoading || coinOverview.isLoading || messages.isRefetching
      }
      empty={{
        enabled:
          tradingViewMessages.length === 0 &&
          !coinOverview.data?.trading_view_chart_id,
        size: 'small',
        refreshButton: true,
        title: t('coin-details.tabs.trading_view.empty.title'),
        subtitle: t('coin-details.tabs.trading_view.empty.subtitle'),
      }}
      onRefresh={() => {
        void messages.refetch();
        void coinOverview.refetch();
      }}
      headerActions={
        <>
          {coinOverview.data?.trading_view_chart_id && (
            <a
              href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(
                coinOverview.data?.trading_view_chart_id,
              )}`}
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
      {coinOverview.data?.trading_view_chart_id && (
        <div className="-mt-4 h-[500px] overflow-hidden rounded-xl bg-v1-surface-l3 p-2 mobile:h-[300px]">
          <AdvancedRealTimeChart
            allow_symbol_change={false}
            symbol={coinOverview.data?.trading_view_chart_id}
            style="1"
            copyrightStyles={{
              parent: {
                display: 'none',
              },
            }}
            hide_side_toolbar
            hotlist={false}
            theme="dark"
            autosize
          />
        </div>
      )}
      {tradingViewMessages.length > 0 && (
        <div className="space-y-4 rounded-xl bg-v1-surface-l3 p-6 mobile:bg-transparent mobile:p-0">
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
