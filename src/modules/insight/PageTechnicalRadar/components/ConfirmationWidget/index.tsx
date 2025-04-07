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
} from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';
import { CoinLabels } from 'shared/CoinLabels';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { useLoadingBadge } from 'shared/LoadingBadge';
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
            coin={value.symbol}
            className="text-xs"
            imageClassName="size-6"
            truncate={90}
          />
        </div>
        <CoinLabels
          categories={value.symbol.categories}
          labels={value.symbol_labels}
          networks={value.networks}
          security={value.symbol_security?.data}
          coin={value.symbol}
          suffix={
            <ConfirmationTimeframeBadge
              combination={combination}
              value={value}
            />
          }
        />
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
  const [selectedTabKey, setSelectedTabKey] = useSearchParamAsState<string>(
    `${indicator}-${type}`,
    tabs[0].key,
  );
  const selectedTab = tabs.find(row => row.key === selectedTabKey);
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
        tabs[tabs.findIndex(r => r.key === selectedTabKey) + 1]?.key;
      if (nextTabKey) {
        setSelectedTabKey(nextTabKey);
      } else {
        setAutoSelect(false);
      }
    }
  }, [confirmations, selectedTabKey, setSelectedTabKey, tabs, autoSelect]);

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
            value={selectedTabKey}
            onChange={newTabKey => {
              setAutoSelect(false);
              setSelectedTabKey(newTabKey);
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
          'guest': true,
          'initial': 2,
          'free': 2,
          'pro': 2,
          'pro+': false,
          'pro_max': false,
        }}
        className="space-y-4"
      >
        {confirmations.data?.results.map(row => (
          <ConfirmationRow
            value={row}
            key={JSON.stringify(row.symbol)}
            combination={selectedTab.combination}
            indicator={indicator}
            type={type}
          />
        ))}
      </AccessShield>
    </OverviewWidget>
  );
}
