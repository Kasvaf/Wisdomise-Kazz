import { Trans } from 'react-i18next';
import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { clsx } from 'clsx';
import {
  type Indicator,
  useIndicatorConfirmations,
  type IndicatorConfirmation,
  type IndicatorConfirmationCombination,
  type IndicatorConfirmationCore,
} from 'api/discovery';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Coin } from 'shared/v1-components/Coin';
import { AccessShield } from 'shared/AccessShield';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { Lazy } from 'shared/Lazy';
import Spin from 'shared/Spin';
import { usePageState } from 'shared/usePageState';
import { IndicatorIcon } from '../IndicatorIcon';
import { TRSAnalysis } from '../TechnicalRadarSentiment/TRSAnalysis';
import {
  useConfirmationTabs,
  type ConfirmationType,
} from './useConfirmationTabs';
import { ConfirmationBadge } from './ConfirmationBadge';
import { ConfirmationTimeframeBadge } from './ConfirmationTimeframeBadge';

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
        'flex w-full flex-col gap-4 rounded-xl bg-v1-surface-l3 p-5 mobile:p-3',
        className,
      )}
    >
      <div className="flex flex-nowrap items-center justify-start gap-4 mobile:flex-wrap">
        <div className="w-32">
          <Coin
            abbreviation={value.symbol.abbreviation}
            name={value.symbol.name}
            slug={value.symbol.slug}
            logo={value.symbol.logo_url}
            categories={value.symbol.categories}
            labels={value.symbol_labels}
            networks={value.networks}
            security={value.symbol_security?.data}
            customLabels={
              <ConfirmationTimeframeBadge
                combination={combination}
                value={value}
              />
            }
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
      title={
        <>
          <div
            className={clsx(
              '[&_b]:font-medium',
              type === 'bullish'
                ? '[&_b]:text-v1-content-positive'
                : '[&_b]:text-v1-content-negative',
            )}
          >
            <IndicatorIcon value={indicator} className="mr-2 align-middle" />
            {type === 'bullish' ? (
              indicator === 'rsi' ? (
                <Trans ns="market-pulse" i18nKey="keywords.rsi_bullish.title" />
              ) : (
                <Trans
                  ns="market-pulse"
                  i18nKey="keywords.macd_bullish.title"
                />
              )
            ) : indicator === 'rsi' ? (
              <Trans ns="market-pulse" i18nKey="keywords.rsi_bearish.title" />
            ) : (
              <Trans ns="market-pulse" i18nKey="keywords.macd_bearish.title" />
            )}
          </div>
        </>
      }
      info={
        type === 'bullish' ? (
          indicator === 'rsi' ? (
            <Trans ns="market-pulse" i18nKey="keywords.rsi_bullish.info" />
          ) : (
            <Trans ns="market-pulse" i18nKey="keywords.macd_bullish.info" />
          )
        ) : indicator === 'rsi' ? (
          <Trans ns="market-pulse" i18nKey="keywords.rsi_bearish.info" />
        ) : (
          <Trans ns="market-pulse" i18nKey="keywords.macd_bearish.info" />
        )
      }
      headerClassName="flex-wrap !justify-start"
      headerActions={
        <>
          {headerActions && (
            <div className="flex grow justify-end">{headerActions}</div>
          )}
          <ButtonSelect
            className="w-full grow"
            value={pageState.tab}
            onChange={newTabKey => {
              setAutoSelect(false);
              setPageState({ tab: newTabKey });
            }}
            options={tabs.map(tab => ({
              label: tab.title,
              value: tab.key,
            }))}
          />
        </>
      }
      loading={confirmations.isLoading}
      empty={confirmations.data?.results.length === 0}
      overlay={overlay}
    >
      <AccessShield
        mode="children"
        sizes={{
          guest: true,
          initial: true,
          free: true,
          vip: false,
        }}
        className="space-y-4"
      >
        {list.slice(0, 6).map(row => (
          <ConfirmationRow
            value={row}
            key={JSON.stringify(row.symbol)}
            combination={selectedTab.combination}
            indicator={indicator}
            type={type}
          />
        ))}
        {list.length > 6 && (
          <Lazy
            freezeOnceVisible
            mountedClassName="space-y-4"
            unMountedClassName="flex h-12 items-center justify-center"
            key={`${indicator}-${type}`}
            fallback={<Spin />}
          >
            {list.slice(6).map(row => (
              <ConfirmationRow
                value={row}
                key={JSON.stringify(row.symbol)}
                combination={selectedTab.combination}
                indicator={indicator}
                type={type}
              />
            ))}
          </Lazy>
        )}
      </AccessShield>
    </OverviewWidget>
  );
}
