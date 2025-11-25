import { clsx } from 'clsx';
import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Trans } from 'react-i18next';
import {
  type Indicator,
  type IndicatorConfirmation,
  type IndicatorConfirmationCombination,
  type IndicatorConfirmationCore,
  useIndicatorConfirmations,
} from 'services/rest/discovery';
import { AccessShield } from 'shared/AccessShield';
import { Lazy } from 'shared/Lazy';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { OverviewWidget } from 'shared/OverviewWidget';
import Spin from 'shared/Spin';
import { usePageState } from 'shared/usePageState';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Token } from 'shared/v1-components/Token';
import { IndicatorIcon } from '../IndicatorIcon';
import { TRSAnalysis } from '../TechnicalRadarSentiment/TRSAnalysis';
import { ConfirmationBadge } from './ConfirmationBadge';
import { ConfirmationTimeframeBadge } from './ConfirmationTimeframeBadge';
import {
  type ConfirmationType,
  useConfirmationTabs,
} from './useConfirmationTabs';

function ConfirmationRow<I extends Indicator>({
  indicator,
  value,
  className,
  combination,
  type,
}: {
  indicator: I;
  value: IndicatorConfirmation<I> & IndicatorConfirmationCore;
  combination: IndicatorConfirmationCombination[];
  type: ConfirmationType;
  className?: string;
}) {
  const infoBadges = useMemo(() => {
    let returnValue: Array<ComponentProps<typeof ConfirmationBadge>> = [];
    returnValue =
      type === 'bullish'
        ? [
            {
              value,
              type: indicator === 'rsi' ? 'rsi_oversold' : 'macd_cross_up',
            },
            {
              value,
              type:
                indicator === 'rsi'
                  ? 'rsi_bullish_divergence'
                  : 'macd_bullish_divergence',
            },
          ]
        : [
            {
              value,
              type: indicator === 'rsi' ? 'rsi_overbought' : 'macd_cross_down',
            },
            {
              value,
              type:
                indicator === 'rsi'
                  ? 'rsi_bearish_divergence'
                  : 'macd_bearish_divergence',
            },
          ];
    return returnValue;
  }, [value, type, indicator]);
  return (
    <div
      className={clsx(
        'flex w-full flex-col gap-4 rounded-xl bg-v1-surface-l3 mobile:p-3 p-5',
        className,
      )}
    >
      <div className="flex mobile:flex-wrap flex-nowrap items-center justify-start gap-4">
        <div className="w-32">
          <Token
            abbreviation={value.symbol.abbreviation}
            categories={value.symbol.categories}
            header={
              <ConfirmationTimeframeBadge
                combination={combination}
                value={value}
              />
            }
            labels={value.symbol_labels}
            logo={value.symbol.logo_url}
            name={value.symbol.name}
            networks={value.networks}
            slug={value.symbol.slug}
          />
        </div>
        <div className="flex grow items-center justify-end gap-2 2xl:gap-3">
          {infoBadges.map((badgeProps, i) => (
            <ConfirmationBadge
              key={`${indicator as string}-${type}-${i}`}
              {...badgeProps}
              mode="summary"
            />
          ))}
        </div>
      </div>
      <TRSAnalysis value={value.analysis} />
    </div>
  );
}

export function ConfirmationWidget<I extends Indicator>({
  className,
  indicator,
  type,
  headerActions,
  overlay,
}: {
  className?: string;
  indicator: I;
  type: ConfirmationType;
  headerActions?: ReactNode;
  overlay?: ReactNode;
}) {
  const tabs = useConfirmationTabs(indicator, type);
  const [autoSelect, setAutoSelect] = useState(true);
  const [pageState, setPageState] = usePageState<{
    tab: string;
  }>(`${indicator}-${type}`, {
    tab: tabs[0].key,
  });
  const selectedTab = tabs.find(row => row.key === pageState.tab);
  if (!selectedTab) throw new Error('unexpected error');
  const confirmations = useIndicatorConfirmations({
    indicator,
    combination: selectedTab.combination,
  });
  useLoadingBadge(confirmations.isLoading);

  useEffect(() => {
    if (!autoSelect) return;
    if (confirmations.isFetched && confirmations.data?.results.length === 0) {
      const nextTabKey =
        tabs[tabs.findIndex(r => r.key === pageState.tab) + 1]?.key;
      if (nextTabKey) {
        setPageState({ tab: nextTabKey });
      } else {
        setAutoSelect(false);
      }
    }
  }, [confirmations, pageState.tab, setPageState, tabs, autoSelect]);

  const list = confirmations.data?.results ?? [];

  return (
    <OverviewWidget
      className={clsx('h-[750px]', className)}
      empty={confirmations.data?.results.length === 0}
      headerActions={
        <>
          {headerActions && (
            <div className="flex grow justify-end">{headerActions}</div>
          )}
          <ButtonSelect
            className="w-full grow"
            onChange={newTabKey => {
              setAutoSelect(false);
              setPageState({ tab: newTabKey });
            }}
            options={tabs.map(tab => ({
              label: tab.title,
              value: tab.key,
            }))}
            value={pageState.tab}
          />
        </>
      }
      headerClassName="flex-wrap !justify-start"
      info={
        type === 'bullish' ? (
          indicator === 'rsi' ? (
            <Trans i18nKey="keywords.rsi_bullish.info" ns="market-pulse" />
          ) : (
            <Trans i18nKey="keywords.macd_bullish.info" ns="market-pulse" />
          )
        ) : indicator === 'rsi' ? (
          <Trans i18nKey="keywords.rsi_bearish.info" ns="market-pulse" />
        ) : (
          <Trans i18nKey="keywords.macd_bearish.info" ns="market-pulse" />
        )
      }
      loading={confirmations.isLoading}
      overlay={overlay}
      title={
        <div
          className={clsx(
            '[&_b]:font-medium',
            type === 'bullish'
              ? '[&_b]:text-v1-content-positive'
              : '[&_b]:text-v1-content-negative',
          )}
        >
          <IndicatorIcon className="mr-2 align-middle" value={indicator} />
          {type === 'bullish' ? (
            indicator === 'rsi' ? (
              <Trans i18nKey="keywords.rsi_bullish.title" ns="market-pulse" />
            ) : (
              <Trans i18nKey="keywords.macd_bullish.title" ns="market-pulse" />
            )
          ) : indicator === 'rsi' ? (
            <Trans i18nKey="keywords.rsi_bearish.title" ns="market-pulse" />
          ) : (
            <Trans i18nKey="keywords.macd_bearish.title" ns="market-pulse" />
          )}
        </div>
      }
    >
      <AccessShield
        className="space-y-4"
        mode="children"
        sizes={{
          guest: true,
          initial: true,
          free: true,
          vip: false,
        }}
      >
        {list.slice(0, 6).map(row => (
          <ConfirmationRow
            combination={selectedTab.combination}
            indicator={indicator}
            key={JSON.stringify(row.symbol)}
            type={type}
            value={row}
          />
        ))}
        {list.length > 6 && (
          <Lazy
            fallback={<Spin />}
            freezeOnceVisible
            key={`${indicator}-${type}`}
            mountedClassName="space-y-4"
            unMountedClassName="flex h-12 items-center justify-center"
          >
            {list.slice(6).map(row => (
              <ConfirmationRow
                combination={selectedTab.combination}
                indicator={indicator}
                key={JSON.stringify(row.symbol)}
                type={type}
                value={row}
              />
            ))}
          </Lazy>
        )}
      </AccessShield>
    </OverviewWidget>
  );
}
