import { useTranslation } from 'react-i18next';
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
} from 'api/market-pulse';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ButtonSelect } from 'shared/ButtonSelect';
import { Coin } from 'shared/Coin';
import { AccessSheild } from 'shared/AccessSheild';
import { CoinLabels } from 'shared/CoinLabels';
import { CoinSecurityLabel } from 'shared/CoinSecurityLabel';
import {
  useConfirmationTabs,
  type ConfirmationType,
} from './useConfirmationTabs';
import { ConfirmationAnalysis } from './ConfirmationAnalysis';
import { ConfirmationInfoBadge } from './ConfirmationInfoBadge';
import { ConfirmationTimeframeBadge } from './ConfirmationTimeframeBadge';

function ConfirmationRow<I extends Indicator>({
  indicator,
  value,
  className,
  combination,
  type,
}: {
  indicator: I;
  value: IndicatorConfirmation<I>;
  combination: IndicatorConfirmationCombination[];
  type: ConfirmationType;
  className?: string;
}) {
  const infoBadges = useMemo(() => {
    let returnValue: Array<ComponentProps<typeof ConfirmationInfoBadge>> = [];
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
          suffix={
            <>
              <CoinSecurityLabel
                value={value.symbol_security?.data}
                coin={value.symbol}
              />
              <ConfirmationTimeframeBadge
                combination={combination}
                value={value}
              />
            </>
          }
        />
        <div className="flex grow items-center justify-end gap-2 2xl:gap-3">
          {infoBadges.map((badgeProps, i) => (
            <ConfirmationInfoBadge
              key={`${indicator as string}-${type}-${i}`}
              {...badgeProps}
            />
          ))}
        </div>
      </div>
      <ConfirmationAnalysis value={value} />
    </div>
  );
}

export function ConfirmationWidget<I extends Indicator>({
  className,
  indicator,
  type,
  headerActions,
}: {
  className?: string;
  indicator: I;
  type: ConfirmationType;
  headerActions?: ReactNode;
}) {
  const { t } = useTranslation('market-pulse');
  const tabs = useConfirmationTabs(indicator, type);
  const [autoSelect, setAutoSelect] = useState(true);
  const [selectedTabKey, setSelectedTabKey] = useState<string>(tabs[0].key);
  const selectedTab = tabs.find(row => row.key === selectedTabKey);
  if (!selectedTab) throw new Error('unexpected error');
  const title =
    type === 'bullish'
      ? t('common.bullish_momentum_confirmation')
      : t('common.bearish_momentum_confirmation');
  const info =
    type === 'bullish'
      ? indicator === 'rsi'
        ? t('indicator_list.rsi.bullish_info')
        : t('indicator_list.macd.bullish_info')
      : indicator === 'rsi'
      ? t('indicator_list.rsi.bearish_info')
      : t('indicator_list.macd.bearish_info');
  const confirmations = useIndicatorConfirmations({
    indicator,
    combination: selectedTab.combination,
  });

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
          <span className="me-[1chr]">{indicator.toUpperCase()}</span>
          <span
            className={clsx(
              type === 'bullish'
                ? 'text-v1-content-positive'
                : 'text-v1-content-negative',
            )}
          >
            {title}
          </span>
        </>
      }
      info={info}
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
    >
      <AccessSheild
        className="flex flex-col items-start gap-3"
        mode="children"
        size={2}
        level={1}
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
      </AccessSheild>
    </OverviewWidget>
  );
}
